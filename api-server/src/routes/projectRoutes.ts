import { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { validateBody, validateQuery } from "../middlewares/validateRequest.js";
import { CreateProjectSchema, ProjectQueryScheme } from "../dtos/project.dto.js";
import { projectController } from "../instances.js";

const projectRouter = Router();

projectRouter.post("/", authenticateToken, validateBody(CreateProjectSchema), projectController.createProject.bind(projectController));

projectRouter.get("/", authenticateToken, validateQuery(ProjectQueryScheme), projectController.getAllProjects.bind(projectController));
// projectRouter.post("/user/project",)

export default projectRouter;
