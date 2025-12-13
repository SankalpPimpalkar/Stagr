import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
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

userSchema.index(
    { username: 1 },
    { unique: true, partialFilterExpression: { isDeleted: false, username: { $type: "string" } } }
)

const User = mongoose.model("User", userSchema);
export default User;