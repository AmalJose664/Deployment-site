import { Router } from "express";
import { validateObjectId } from "../middleware/validate.js";
import { extraProxy } from "../middleware/proxy.js";
import { invalidateSlugs, trackCacheAnalytics } from "../controller/extrasController.js";

const router = Router()

router.get("/track", trackCacheAnalytics)

router.get("/invalidate/:slug", invalidateSlugs)

router.get(
	"/download-file/:projectId/:deploymentId/",
	validateObjectId("projectId"),
	validateObjectId("deploymentId"),
	extraProxy
)
export default router