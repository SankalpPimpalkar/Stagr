import { Router } from "express";
import {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    isFollowing,
} from "../controllers/follow.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const followRouter = Router();

followRouter.post("/:userId", protectRoute, followUser);
followRouter.delete("/:userId", protectRoute, unfollowUser);
followRouter.get("/followers/:userId", getFollowers);
followRouter.get("/following/:userId", getFollowing);
followRouter.get("/is-following/:userId", protectRoute, isFollowing);

export default followRouter;
