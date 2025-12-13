import { Router } from "express"
import { protectRoute } from "../middlewares/auth.middleware.js"
import { createPost, deletePost, editPost, getAllPosts, toggleLikePost } from "../controllers/post.controller.js"

const postRouter = Router()

postRouter.get("/", protectRoute, getAllPosts)
postRouter.post("/", protectRoute, createPost)
postRouter.delete("/:postId", protectRoute, deletePost)
postRouter.put("/:postId", protectRoute, editPost)
postRouter.patch("/:postId", protectRoute, toggleLikePost)

export default postRouter