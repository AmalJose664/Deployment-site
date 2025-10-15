import UserService from "./services/user.service.js";
import ProjectService from "./services/project.service.js";
import DeploymentService from "./services/deployment.service.js";

import UserRepo from "./repositories/user.repository.js";
import ProjectRepo from "./repositories/project.repository.js";
import DeploymentRepo from "./repositories/deployment.repository.js";

import ProjectController from "./controllers/projectController.js";
import DeploymentController from "./controllers/deploymentController.js";

export const userRepo = new UserRepo();
export const projectRepo = new ProjectRepo();
export const deploymentRepo = new DeploymentRepo();

export const userService = new UserService(userRepo);
export const projectService = new ProjectService(projectRepo, userRepo);
export const deploymentService = new DeploymentService(deploymentRepo, projectRepo);

export const projectController = new ProjectController(projectService);
export const deploymentController = new DeploymentController(deploymentService);

