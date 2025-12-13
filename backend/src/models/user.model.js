import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    imageUrl: {
        type: String,
    },
    clerkId: {
        type: String,
        required: true,
        unique: true
    },
    bio: {
        type: String,
        default: ""
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const User = mongoose.model("User", userSchema);
export default User;