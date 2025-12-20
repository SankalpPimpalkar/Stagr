import { Router } from "express"
import { protectRoute } from "../middlewares/auth.middleware.js"
import { createPost, deletePost, editPost, getAllPosts, toggleLikePost } from "../controllers/post.controller.js"
import { upload } from "../middlewares/multer.middleware.js"

const postRouter = Router()

postRouter.get("/", protectRoute, getAllPosts)
postRouter.post("/", protectRoute, upload.array("images"), createPost)
postRouter.delete("/:postId", protectRoute, deletePost)
postRouter.put("/:postId", protectRoute, upload.array("images"), editPost)
postRouter.post("/:postId", protectRoute, toggleLikePost)

export default postRouter