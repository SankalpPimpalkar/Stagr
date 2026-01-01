import Follow from "../models/follow.model.js";

export async function followUser(req, res) {
    try {
        const followerId = req.user._id;
        const followingId = req.params.userId;

        if (followerId === followingId) {
            return res
                .status(400)
                .json({ message: "You cannot follow yourself" });
        }

        await Follow.create({
            follower: followerId,
            following: followingId,
        });

        return res
            .status(201)
            .json({ message: "User followed successfully" });

    } catch (error) {
        if (error.code === 11000) {
            return res
                .status(400)
                .json({ message: "Already following this user" });
        }

        console.error("Error in Follow User", error);
        return res
            .status(500)
            .json({ message: "Internal Server Error" });
    }
}

export async function unfollowUser(req, res) {
    try {
        const followerId = req.user._id;
        const followingId = req.params.userId;

        const result = await Follow.findOneAndDelete({
            follower: followerId,
            following: followingId,
        });

        if (!result) {
            return res
                .status(404)
                .json({ message: "You are not following this user" });
        }

        return res
            .status(200)
            .json({ message: "User unfollowed successfully" });

    } catch (error) {
        console.error("Error in Unfollow User", error);
        return res
            .status(500)
            .json({ message: "Internal Server Error" });
    }
}

export async function getFollowers(req, res) {
    try {
        const userId = req.params.userId;

        const followers = await Follow.find({ following: userId })
            .populate("follower", "name username imageUrl")
            .select("-__v")
            .exec();

        return res
            .status(200)
            .json({
                message: "Followers fetched",
                count: followers.length,
                followers,
            });

    } catch (error) {
        console.error("Error in Get Followers", error);
        return res
            .status(500)
            .json({ message: "Internal Server Error" });
    }
}

export async function getFollowing(req, res) {
    try {
        const userId = req.params.userId;

        const following = await Follow.find({ follower: userId })
            .populate("following", "name username imageUrl")
            .select("-__v")
            .exec();

        return res
            .status(200)
            .json({
                message: "Following fetched",
                count: following.length,
                following,
            });

    } catch (error) {
        console.error("Error in Get Following", error);
        return res
            .status(500)
            .json({ message: "Internal Server Error" });
    }
}

export async function isFollowing(req, res) {
    try {
        const followerId = req.user._id;
        const followingId = req.params.userId;

        const follow = await Follow.findOne({
            follower: followerId,
            following: followingId,
        }).exec();

        return res
            .status(200)
            .json({
                message: "Follow status fetched",
                isFollowing: !!follow,
            });

    } catch (error) {
        console.error("Error in Is Following", error);
        return res
            .status(500)
            .json({ message: "Internal Server Error" });
    }
}
