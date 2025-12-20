import Tag from "../models/tag.model.js";
import Story from "../models/story.model.js";

/* ================= CREATE TAG ================= */
export async function createTag(req, res) {
    try {
        const { storyId, content } = req.body;
        const user = req.user;

        if (!content) {
            return res.status(400).json({ message: "Content is required" });
        }

        const story = await Story.findById(storyId);
        if (!story) {
            return res.status(404).json({ message: "Story not found" });
        }

        const tag = await Tag.create({
            story: storyId,
            owner: user._id,
            content
        });

        const populatedTag = await Tag.findById(tag._id)
            .populate("owner", "username imageUrl");

        return res.status(201).json({
            message: "Tag created",
            tag: populatedTag
        });

    } catch (error) {
        console.error("Error creating tag:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

/* ================= EDIT TAG ================= */
export async function editTag(req, res) {
    try {
        const { tagId } = req.params;
        const { content } = req.body;
        const user = req.user;

        const tag = await Tag.findById(tagId);

        if (!tag) {
            return res.status(404).json({ message: "Tag not found" });
        }

        if (tag.owner.toString() !== user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" });
        }

        tag.content = content || tag.content;
        await tag.save();

        return res.status(200).json({ message: "Tag updated", tag });

    } catch (error) {
        console.error("Error updating tag:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

/* ================= DELETE TAG ================= */
export async function deleteTag(req, res) {
    try {
        const { tagId } = req.params;
        const user = req.user;

        const tag = await Tag.findById(tagId);

        if (!tag) {
            return res.status(404).json({ message: "Tag not found" });
        }

        if (tag.owner.toString() !== user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" });
        }

        await Tag.findByIdAndDelete(tagId);

        return res.status(200).json({ message: "Tag deleted" });

    } catch (error) {
        console.error("Error deleting tag:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

/* ================= GET TAGS BY STORY ================= */
export async function getTagsByStory(req, res) {
    try {
        const { storyId } = req.params;

        const tags = await Tag.find({ story: storyId })
            .sort({ createdAt: -1 })
            .populate("owner", "username imageUrl")
            .lean();

        return res.status(200).json({ tags });

    } catch (error) {
        console.error("Error fetching tags:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

/* ================= TOGGLE LIKE TAG ================= */
export async function toggleLikeTag(req, res) {
    try {
        const { tagId } = req.params;
        const user = req.user;

        const tag = await Tag.findById(tagId);

        if (!tag) {
            return res.status(404).json({ message: "Tag not found" });
        }

        const isLiked = tag.likes.includes(user._id);

        if (isLiked) {
            tag.likes.pull(user._id);
        } else {
            tag.likes.push(user._id);
        }

        await tag.save();

        return res.status(200).json({
            message: `Tag ${isLiked ? "unliked" : "liked"}`
        });

    } catch (error) {
        console.error("Error liking tag:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
