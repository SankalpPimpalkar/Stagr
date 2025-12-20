import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
    createTag,
    editTag,
    deleteTag,
    getTagsByStory,
    toggleLikeTag
} from "../controllers/tag.controller.js";

const tagRouter = Router();

tagRouter.post("/", protectRoute, createTag);
tagRouter.get("/story/:storyId", protectRoute, getTagsByStory);
tagRouter.patch("/:tagId", protectRoute, editTag);
tagRouter.delete("/:tagId", protectRoute, deleteTag);
tagRouter.post("/:tagId/like", protectRoute, toggleLikeTag);

export default tagRouter;
