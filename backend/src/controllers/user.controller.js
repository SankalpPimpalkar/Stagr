import User from "../models/user.model.js"

export async function checkUsernameAvailability(req, res) {
    try {
        const username = (req.query.username || "").trim().toLowerCase()

        const existingUsername = await User.countDocuments({ username })

        return res
            .status(200)
            .json({ message: "Fetched Username Availability", isAvailable: existingUsername === 0 })

    } catch (error) {
        console.error("Error in Getting Username Availability Status", error)
        return res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}

export async function updateUsername(req, res) {
    try {
        const { username } = req.body
        const user = req.user

        if (!username) {
            return res
                .status(400)
                .json({ message: "Username required" })
        }

        const existingUsername = await User.findOne({ username: username.toLowerCase() })

        if (existingUsername) {
            return res
                .status(400)
                .json({ message: "Usernae already taken" })
        }

        user.username = username.trim().toLowerCase()
        await user.save()

        return res
            .status(200)
            .json({ message: "Username Updated" })

    } catch (error) {
        console.error("Error in Updating Username", error)
        return res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}

export async function updateBio(req, res) {
    try {
        const { bio = "" } = req.body
        const user = req.user

        user.bio = bio.trim()
        await user.save()

        return res
            .status(200)
            .json({ message: "Bio Updated" })

    } catch (error) {
        console.error("Error in Updating Bio", error)
        return res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}

export async function searchUsers(req, res) {
    try {
        const searchQuery = req.query.search || "";
        const regex = new RegExp(searchQuery, 'i');

        const users = await User.find({
            $or: [
                { username: regex },
                { name: regex },
            ]
        }).select("name username imageUrl").exec()

        return res
            .status(200)
            .json({ message: "Users Fetched", users })

    } catch (error) {
        console.error("Error in Updating Bio", error)
        return res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}

export async function getCurrentUser(req, res) {
    try {
        const user = req.user

        return res
            .status(200)
            .json({ message: "Current User Fetched", user })

    } catch (error) {
        console.error("Error in Getting Current User", error)
        return res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}

export async function getUserByUsername(req, res) {
    try {
        const { username } = req.params

        if (!username) {
            return res
                .status(400)
                .json({
                    message: "Username is required"
                })
        }

        const user = await User.findOne({ username: regex })
            .select("name username imageUrl bio createdAt")

        return res
            .status(200)
            .json({ message: "User by Username Fetched", user })

    } catch (error) {
        console.error("Error in Getting User by Username", error)
        return res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}