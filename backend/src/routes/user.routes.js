import { Router } from "express"
import { protectRoute } from "../middlewares/auth.middleware.js"
import { searchUsers, checkUsernameAvailability, updateBio, updateUsername, getCurrentUser, getUserByUsername } from "../controllers/user.controller.js"

const userRouter = Router()

userRouter.get("/", protectRoute, searchUsers)
userRouter.get("/me", protectRoute, getCurrentUser)
userRouter.get("/u/:username", protectRoute, getUserByUsername)
userRouter.get("/username", protectRoute, checkUsernameAvailability)

userRouter.patch("/bio", protectRoute, updateBio)
userRouter.patch("/username", protectRoute, updateUsername)

export default userRouter