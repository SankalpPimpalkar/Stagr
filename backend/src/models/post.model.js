import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    images: [{ type: String }],
    tags: [{ type: String }],
    description: { type: String },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
}, { timestamps: true })

const Post = mongoose.model("Post", postSchema)
export default Post