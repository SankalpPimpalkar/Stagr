import cloudinary from "../configs/cloudinary.config.js";
import Story from "../models/story.model.js";
import User from "../models/user.model.js";

/* ================= CREATE STORY ================= */
export async function createStory(req, res) {
    try {
        const { title, content } = req.body;
        const user = req.user;

        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Cover image is required" });
        }

        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            folder: "stories"
        });

        const story = await Story.create({
            title: title.trim(),
            content,
            coverImage: uploadResult.secure_url,
            owner: user._id
        });

        const populatedStory = await Story.findById(story._id)
            .populate("owner", "username imageUrl");

        return res.status(201).json({
            message: "Story created",
            story: populatedStory
        });

    } catch (error) {
        console.error("Error creating story:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

/* ================= EDIT STORY ================= */
export async function editStory(req, res) {
    try {
        const { storyId } = req.params;
        const { title, content } = req.body;
        const user = req.user;

        const story = await Story.findById(storyId);

        if (!story) {
            return res.status(404).json({ message: "Story not found" });
        }

        if (story.owner.toString() !== user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" });
        }

        if (title) story.title = title.trim();
        if (content) story.content = content;

        if (req.file) {
            // delete old image
            const publicId = "stories/" + story.coverImage.split("/stories")[1]?.split(".")[0];
            if (publicId) await cloudinary.uploader.destroy(publicId);

            // upload new
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: "stories"
            });

            story.coverImage = uploadResult.secure_url;
        }

        const updatedStory = await story.save();

        return res.status(200).json({
            message: "Story updated",
            story: updatedStory
        });

    } catch (error) {
        console.error("Error updating story:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

/* ================= DELETE STORY ================= */
export async function deleteStory(req, res) {
    try {
        const { storyId } = req.params;
        const user = req.user;

        const story = await Story.findById(storyId);

        if (!story) {
            return res.status(404).json({ message: "Story not found" });
        }

        if (story.owner.toString() !== user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const publicId = "stories/" + story.coverImage.split("/stories")[1]?.split(".")[0];
        if (publicId) await cloudinary.uploader.destroy(publicId);

        await Story.findByIdAndDelete(storyId);

        return res.status(200).json({ message: "Story deleted" });

    } catch (error) {
        console.error("Error deleting story:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

/* ================= GET ALL STORIES ================= */
export async function getAllStories(req, res) {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 10, 50);
        const skip = (page - 1) * limit;

        const filterQuery = {};

        if (req.query.username) {
            const user = await User.findOne({ username: req.query.username })
                .select("_id");
            if (!user) {
                return res.json({ page, totalStories: 0, stories: [] });
            }
            filterQuery.owner = user._id;
        }

        const [stories, totalStories] = await Promise.all([
            Story.find(filterQuery)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("owner", "username imageUrl")
                .lean(),
            Story.countDocuments(filterQuery)
        ]);

        return res.status(200).json({
            page,
            totalPages: Math.ceil(totalStories / limit),
            totalStories,
            stories
        });

    } catch (error) {
        console.error("Error fetching stories:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

/* ================= TOGGLE LIKE STORY ================= */
export async function toggleLikeStory(req, res) {
    try {
        const { storyId } = req.params;
        const user = req.user;

        const story = await Story.findById(storyId);

        if (!story) {
            return res.status(404).json({ message: "Story not found" });
        }

        const isLiked = story.likes.includes(user._id);

        if (isLiked) {
            story.likes.pull(user._id);
        } else {
            story.likes.push(user._id);
        }

        await story.save();

        return res.status(200).json({
            message: `Story ${isLiked ? "unliked" : "liked"}`
        });

    } catch (error) {
        console.error("Error liking story:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
