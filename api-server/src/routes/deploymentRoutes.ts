import { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { deploymentController, deploymentService, logsController } from "../instances.js";
import { validateObjectId } from "../middlewares/validateObjectId.js";
import { validateBody, validateQuery } from "../middlewares/validateRequest.js";
import { CreateDeploymentSchema, DeploymentQueryScheme } from "../dtos/deployment.dto.js";

const deploymentRouter = Router({ mergeParams: true });

deploymentRouter.get("/", authenticateToken, validateQuery(DeploymentQueryScheme), deploymentController.getAllDeployments.bind(deploymentController));

deploymentRouter.get("/test", (_, res) => {
    deploymentService.deployLocal("68fb232493aa0518027f51d5", "68fb1ccb10b93de245fa9f55");
    res.json({ ok: "true" });
});

deploymentRouter.get(
    "/:deploymentId",
    authenticateToken,
    validateObjectId("deploymentId"),
    deploymentController.getDeployment.bind(deploymentController),
);

deploymentRouter.get(
    "/:deploymentId/logs",
    authenticateToken,
    validateObjectId("deploymentId"),
    logsController.getLogsByDeployment.bind(logsController),
);
deploymentRouter.get(
    "/:deploymentId/logs/stream",
    authenticateToken,
    validateObjectId("deploymentId"),
    logsController.streamLogs.bind(logsController),
);

export default deploymentRouter;
