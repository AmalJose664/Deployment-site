import { Router } from "express";
import { validateObjectId } from "../middleware/validate.js";
import { extraProxy } from "../middleware/proxy.js";
import { downloadFilesCloud, trackCacheAnalytics } from "../controller/extrasController.js";
import { STORAGE_MODE } from "../constants/paths.js";


const router = Router()

router.get("/track", trackCacheAnalytics)

router.get(
	"/download-file/:projectId/:deploymentId/",
	validateObjectId("projectId"),
	validateObjectId("deploymentId"),
	STORAGE_MODE === "cloud" ? downloadFilesCloud : extraProxy
)
export default router