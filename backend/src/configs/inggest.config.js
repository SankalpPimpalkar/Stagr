import { Inngest } from "inngest";
import dbconnect from "./db.config.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import ENV from "./env.config.js";

export const INNGEST = new Inngest({
    id: "my-app",
    isDev: ENV.NODE_ENV === "DEV",

});

const syncUser = INNGEST.createFunction(
    { id: "sync-user" },
    { event: "clerk/user.created" },
    async ({ event }) => {
        await dbconnect()
        const { id, username, email_addresses, first_name, last_name, image_url } = event.data;

        const newUser = {
            clerkId: id,
            username: username || "",
            email: email_addresses[0]?.email_address,
            name: `${first_name || ""} ${last_name || ""}` || "User",
            imageUrl: image_url
        }
        console.log(event.data)

        await User.create(newUser)
    }
)

const deleteUserFromDB = INNGEST.createFunction(
    { id: "delete-user-from-db" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        await dbconnect()
        const { id } = event.data
        const user = await User.findOne({ clerkId: id })
        await Post.deleteMany({ owner: user._id })
        await User.deleteOne({ clerkId: id })
        console.log("USER", user)
    }
)

export const functions = [syncUser, deleteUserFromDB];