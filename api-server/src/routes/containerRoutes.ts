import { Router } from "express";
import { validateObjectId } from "../middlewares/validateObjectId.js";
import { authenticaContainerteToken } from "../middlewares/authContainerMiddleware.js";
import { deploymentController, projectController } from "../instances.js";

const internalRoutes = Router();

internalRoutes.get("/projects/:id", authenticaContainerteToken, validateObjectId, projectController.__getProjects.bind(projectController));

internalRoutes.get(
    "/deployments/:id",
    authenticaContainerteToken,
    validateObjectId,
    deploymentController.__getDeployments.bind(deploymentController),
);

export default internalRoutes;
