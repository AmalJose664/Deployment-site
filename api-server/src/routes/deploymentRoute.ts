import { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { deploymentController } from "../instances.js";
import { validateObjectId } from "../middlewares/validateObjectId.js";
import { validateBody, validateQuery } from "../middlewares/validateRequest.js";
import { CreateDeploymentSchema, DeploymentQueryScheme } from "../dtos/deployment.dto.js";

const deploymentRouter = Router();

deploymentRouter.post(
	"/new",
	authenticateToken,
	validateBody(CreateDeploymentSchema),
	deploymentController.createDeployment.bind(deploymentController),
);

deploymentRouter.get("/", authenticateToken, validateQuery(DeploymentQueryScheme), deploymentController.getAllDeployments.bind(deploymentController));
deploymentRouter.get("/:id", authenticateToken, validateObjectId, deploymentController.getDeployment.bind(deploymentController));


deploymentRouter.get("/project/:id",
	authenticateToken,
	validateObjectId,
	validateQuery(DeploymentQueryScheme),
	deploymentController.getProjectDeployments.bind(deploymentController));

export default deploymentRouter;
