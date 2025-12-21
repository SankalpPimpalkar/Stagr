import cloudinary from "../configs/cloudinary.config.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

export async function createPost(req, res) {
    try {
        const { description = "", tags = [] } = req.body;
        const user = req.user;
        console.log("CREATE POST BODY", description, req.files)

        if (!req.files || req.files.length === 0) {
            return res
                .status(400)
                .json({ message: "Atleast one image is required to create post" })
        }

        const uploadPromises = req.files.map((file) => {
            return cloudinary.uploader.upload(file.path, {
                folder: "posts"
            })
        })

        const uploadResults = await Promise.all(uploadPromises)
        const imageUrls = uploadResults.map((result) => result.secure_url)

        const newPost = await Post.create({
            description,
            owner: user._id,
            images: imageUrls,
            tags
        })

        const post = await Post.findById(newPost._id).populate("owner", "username imageUrl")

        return res
            .status(201)
            .json({ message: "Post Created", post })

    } catch (error) {
        console.error("Error in Creating Post", error)
        return res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}

export async function editPost(req, res) {
    try {
        const { description = "", tags = [] } = req.body;
        const { postId } = req.params
        const user = req.user

        const post = await Post.findById(postId).populate("owner", "username imageUrl")

        if (!post) {
            return res
                .status(404)
                .json({ message: "Post not found" })
        }

        if (post.owner._id.toString() !== user._id.toString()) {
            return res
                .status(401)
                .json({ message: "You are not authorized to edit this post" })
        }

        if (description) post.description = description.trim()
        if (tags.length > 0) post.tags = tags

        if (req.files && req.files.length > 0) {
            // Deleting Previous Posts
            const deletePromises = post.images.map(imageUrl => {
                const publicId = "posts/" + imageUrl.split("/posts")[1]?.split(".")[0];
                if (publicId) return cloudinary.uploader.destroy(publicId)
            })
            await Promise.all(deletePromises.filter(Boolean))

            // Uploading New Posts
            const uploadPromises = req.files.map((file) => {
                return cloudinary.uploader.upload(file.path, {
                    folder: "posts"
                })
            })

            const uploadResults = await Promise.all(uploadPromises)
            const imageUrls = uploadResults.map((result) => result.secure_url)
            post.images = imageUrls
        }

        const updatedPost = await post.save()

        return res
            .status(200)
            .json({ message: "Post Updated", post: updatedPost })

    } catch (error) {
        console.error("Error in Updating Post", error)
        return res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}

export async function deletePost(req, res) {
    try {
        const { postId } = req.params
        const user = req.user

        const post = await Post.findById(postId).populate("owner", "username imageUrl")

        if (!post) {
            return res
                .status(404)
                .json({ message: "Post not found" })
        }

        if (post.owner._id.toString() !== user._id.toString()) {
            return res
                .status(401)
                .json({ message: "You are not authorized to delete this post" })
        }

        const deletePromises = post.images.map(imageUrl => {
            const publicId = "posts/" + imageUrl.split("/posts")[1]?.split(".")[0];
            if (publicId) return cloudinary.uploader.destroy(publicId)
        })

        await Promise.all(deletePromises.filter(Boolean))
        await Post.findByIdAndDelete(post._id)

        return res
            .status(200)
            .json({ message: "Post Deleted" })

    } catch (error) {
        console.error("Error in Deleting Post", error)
        return res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}

export async function getAllPosts(req, res) {
    try {
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.min(
            Math.max(parseInt(req.query.limit, 10) || 10, 1),
            50
        );
        const skip = (page - 1) * limit;

        const filterQuery = {};

        let tags = [];
        if (req.query.tags) {
            if (Array.isArray(req.query.tags)) {
                tags = req.query.tags;
            } else if (typeof req.query.tags === "string") {
                tags = req.query.tags.split(",").map(t => t.trim());
            }

            if (tags.length > 0) {
                filterQuery.tags = { $in: tags };
            }
        }

        const keyword = typeof req.query.keyword === "string"
            ? req.query.keyword.trim()
            : "";

        if (keyword.length > 0 && keyword.length <= 50) {
            const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            filterQuery.description = {
                $regex: escapedKeyword,
                $options: "i"
            };
        }

        if (typeof req.query.username === "string") {
            const username = req.query.username.trim().toLowerCase();
            if (username.length > 0) {
                const owner = await User.findOne({ username }).select("_id").lean();
                if (!owner) {
                    return res.status(200).json({
                        message: "Fetched posts",
                        page,
                        limit,
                        totalPages: 0,
                        totalPosts: 0,
                        posts: []
                    });
                }
                filterQuery.owner = owner._id;
            }
        }

        const [posts, totalPosts] = await Promise.all([
            Post.find(filterQuery)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("owner", "name username imageUrl")
                .select("description owner likes images tags createdAt updatedAt")
                .lean()
                .exec(),
            Post.countDocuments(filterQuery)
        ]);

        const totalPages = Math.ceil(totalPosts / limit);

        return res.status(200).json({
            message: "Fetched posts",
            page,
            limit,
            totalPages,
            totalPosts,
            posts
        });

    } catch (err) {
        console.error("Error fetching posts:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


export async function toggleLikePost(req, res) {
    try {
        const { postId } = req.params
        const user = req.user

        const post = await Post.findById(postId).populate("owner", "username imageUrl")

        if (!post) {
            return res
                .status(404)
                .json({ message: "Post not found" })
        }

        let isLikedPost = post.likes.some(like => like._id.toString() === user._id.toString())

        if (isLikedPost) {
            post.likes.pull(user._id)
        } else {
            post.likes.push(user._id)
        }

        await post.save()

        return res
            .status(200)
            .json({ message: `Post ${isLikedPost ? "disliked" : "liked"}` })

    } catch (error) {
        console.error("Error in Liking Post", error)
        return res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}