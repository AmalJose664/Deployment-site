import { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { validateBody, validateQuery } from "../middlewares/validateRequest.js";
import { CreateProjectSchema, ProjectQueryScheme } from "../dtos/project.dto.js";
import { deploymentController, logsController, projectController } from "../instances.js";
import { validateObjectId } from "../middlewares/validateObjectId.js";
import { DeploymentQueryScheme } from "../dtos/deployment.dto.js";

const projectRouter = Router();

projectRouter.get("/", authenticateToken, validateQuery(ProjectQueryScheme), projectController.getAllProjects.bind(projectController));
projectRouter.post("/", authenticateToken, validateBody(CreateProjectSchema), projectController.createProject.bind(projectController));

projectRouter.get("/:projectId",
	authenticateToken,
	validateObjectId("projectId"),
	projectController.getProject.bind(projectController)
);
projectRouter.patch(
	"/:projectId",
	authenticateToken,
	validateObjectId("projectId"),
	validateBody(CreateProjectSchema.omit({ repoURL: true })),
	projectController.updateProject.bind(projectController)
);
projectRouter.delete(
	"/:projectId",
	authenticateToken,
	validateObjectId("projectId"),
	projectController.deleteProject.bind(projectController)
);

projectRouter.get(
	"/:projectId/deployments",
	authenticateToken,
	validateObjectId("projectId"),
	validateQuery(DeploymentQueryScheme),
	deploymentController.getDeploymentsByProject.bind(deploymentController),
);

projectRouter.post(
	"/:projectId/deployments",
	authenticateToken,
	validateObjectId("projectId"),
	deploymentController.createDeployment.bind(deploymentController),
);
projectRouter.delete(
	"/:projectId/deployments/:deploymentId/",
	authenticateToken,
	validateObjectId("projectId"),
	validateObjectId("deploymentId"),
	deploymentController.deleteDeployment.bind(deploymentController),
);

projectRouter.get("/:projectId/logs", authenticateToken, validateObjectId("projectId"), logsController.getLogsByProject.bind(logsController));

export default projectRouter;
