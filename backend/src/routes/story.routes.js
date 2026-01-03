import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
    createStory,
    editStory,
    deleteStory,
    getAllStories,
    toggleLikeStory,
    getStoryById
} from "../controllers/story.controller.js";

const storyRouter = Router();

storyRouter.post("/", protectRoute, upload.single("coverImage"), createStory);
storyRouter.get("/", protectRoute, getAllStories);
storyRouter.patch("/:storyId", protectRoute, upload.single("coverImage"), editStory);
storyRouter.delete("/:storyId", protectRoute, deleteStory);
storyRouter.post("/:storyId/like", protectRoute, toggleLikeStory);
storyRouter.get("/:storyId", protectRoute, getStoryById);

export default storyRouter;
