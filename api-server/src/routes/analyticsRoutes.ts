import { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { validateObjectId } from "../middlewares/validateObjectId.js";
import { analyticsController } from "../instances.js";

const analyticsRouter = Router();


analyticsRouter.get(
	"/:projectId/bandwidth",
	authenticateToken,
	validateObjectId("projectId"),
	analyticsController.bandWidth.bind(analyticsController)
)
analyticsRouter.get(
	"/:projectId/overview/",
	authenticateToken,
	validateObjectId("projectId"),
	analyticsController.overview.bind(analyticsController)
)

export default analyticsRouter