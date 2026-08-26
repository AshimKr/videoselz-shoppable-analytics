import { Router } from "express";
import { getVideosAnalytics } from "../controllers/analytics.controller.js";

const router = Router();

router.get("/videos", getVideosAnalytics);

export default router;