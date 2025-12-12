import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
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
        type: String
    }
}, { timestamps: true })

const User = mongoose.model("User", userSchema);
export default User;