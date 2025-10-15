import { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { deploymentController } from "../instances.js";
import { validateObjectId } from "../middlewares/validateObjectId.js";
import { validateBody } from "../middlewares/validateRequest.js";
import { createDeploymentSchema } from "../dtos/deployment.dto.js";

const deploymentRouter = Router();

deploymentRouter.post(
    "/new",
    authenticateToken,
    validateBody(createDeploymentSchema),
    deploymentController.createDeployment.bind(deploymentController),
);

deploymentRouter.get("/", authenticateToken, deploymentController.getAllDeployments.bind(deploymentController));

deploymentRouter.get("/project/:id", authenticateToken, validateObjectId, deploymentController.getProjectDeployments.bind(deploymentController));

export default deploymentRouter;
