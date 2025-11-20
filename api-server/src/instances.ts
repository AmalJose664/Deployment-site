import UserRepo from "./repositories/user.repository.js";
import ProjectRepo from "./repositories/project.repository.js";
import DeploymentRepo from "./repositories/deployment.repository.js";
import LogRepo from "./repositories/log.repository.js";
import AnalyticsRepo from "./repositories/analytics.repository.js";

import UserService from "./services/user.service.js";
import ProjectService from "./services/project.service.js";
import DeploymentService from "./services/deployment.service.js";
import LogsService from "./services/logs.service.js";
import AnalyticsService from "./services/analytics.service.js";

import ProjectController from "./controllers/projectController.js";
import DeploymentController from "./controllers/deploymentController.js";
import LogsController from "./controllers/logsController.js";
import AnalyticsController from "./controllers/analyticsController.js";

import { client } from "./config/clickhouse.js";

export const userRepo = new UserRepo();
export const projectRepo = new ProjectRepo();
export const deploymentRepo = new DeploymentRepo();
export const logRepo = new LogRepo(client);
export const analyticsRepo = new AnalyticsRepo(client);

export const userService = new UserService(userRepo);
export const projectService = new ProjectService(projectRepo, userRepo);
export const deploymentService = new DeploymentService(deploymentRepo, projectRepo);
export const logsService = new LogsService(logRepo, deploymentRepo);
export const analyticsService = new AnalyticsService(analyticsRepo);

export const projectController = new ProjectController(projectService);
export const deploymentController = new DeploymentController(deploymentService);
export const logsController = new LogsController(logsService);
export const analyticsController = new AnalyticsController(analyticsService);
