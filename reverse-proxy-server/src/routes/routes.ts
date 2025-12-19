import { Router } from "express";
import { validateObjectId } from "../middleware/validate.js";
import { extraProxy } from "../middleware/proxy.js";
import { invalidateSlugs } from "../controller/extrasController.js";

const router = Router()

router.get("/track", (req, res) => {
	console.log(req.header("X-Original-URI"))
	console.log(req.header("X-Real-IP"))
	console.log(req.header("X-Host"))
	res.json({})
})

router.get("/invalidate/:slug", invalidateSlugs)

router.get(
	"/download-file/:projectId/:deploymentId/",
	validateObjectId("projectId"),
	validateObjectId("deploymentId"),
	extraProxy
)
export default router