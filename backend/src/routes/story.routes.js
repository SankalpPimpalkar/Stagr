import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
    createStory,
    editStory,
    deleteStory,
    getAllStories,
    toggleLikeStory
} from "../controllers/story.controller.js";

const storyRouter = Router();

storyRouter.post("/", protectRoute, createStory);
storyRouter.get("/", protectRoute, getAllStories);
storyRouter.patch("/:storyId", protectRoute, editStory);
storyRouter.delete("/:storyId", protectRoute, deleteStory);
storyRouter.post("/:storyId/like", protectRoute, toggleLikeStory);

export default storyRouter;
