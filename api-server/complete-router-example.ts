import { Router } from "express";
import { z } from "zod";
import { validateRequest, validateBody, validateQuery, validateParams, validateMultiple, getValidatedData } from "./middleware/zodValidation.js";
import {
    CreateProjectSchema,
    UpdateProjectSchema,
    ProjectQuerySchema,
    CreateDeploymentSchema,
    DeploymentQuerySchema,
    CancelDeploymentSchema,
    RollbackDeploymentSchema,
    type CreateProjectDTO,
    type UpdateProjectDTO,
    type ProjectQueryDTO,
    type CreateDeploymentDTO,
} from "./dtos/vercelClone.dto.js";
import { authenticateToken } from "./middleware/auth.js";

// ==================== PROJECT ROUTES ====================

const projectRouter = Router();

// Create a new project
projectRouter.post(
    "/",
    authenticateToken,
    validateRequest(CreateProjectSchema), // Auto-detects POST body
    ProjectController.createProject.bind(ProjectController),
);

// Get all projects with filtering and pagination
projectRouter.get(
    "/",
    authenticateToken,
    validateRequest(ProjectQuerySchema), // Auto-detects GET query
    ProjectController.getAllProjects.bind(ProjectController),
);

// Get single project by ID
projectRouter.get(
    "/:projectId",
    authenticateToken,
    validateParams(
        z.object({
            projectId: z.string().uuid("Invalid project ID"),
        }),
    ),
    ProjectController.getProject.bind(ProjectController),
);

// Update project
projectRouter.put(
    "/:projectId",
    authenticateToken,
    validateMultiple({
        params: z.object({ projectId: z.string().uuid() }),
        body: UpdateProjectSchema.omit({ projectId: true }), // Remove projectId from body, use params
    }),
    ProjectController.updateProject.bind(ProjectController),
);

// Delete project
projectRouter.delete(
    "/:projectId",
    authenticateToken,
    validateParams(
        z.object({
            projectId: z.string().uuid(),
        }),
    ),
    ProjectController.deleteProject.bind(ProjectController),
);

// ==================== DEPLOYMENT ROUTES ====================

const deploymentRouter = Router();

// Create new deployment
deploymentRouter.post(
    "/projects/:projectId/deployments",
    authenticateToken,
    validateMultiple({
        params: z.object({ projectId: z.string().uuid() }),
        body: CreateDeploymentSchema.omit({ projectId: true }), // projectId comes from params
    }),
    DeploymentController.createDeployment.bind(DeploymentController),
);

// Get all deployments for a project
deploymentRouter.get(
    "/projects/:projectId/deployments",
    authenticateToken,
    validateMultiple({
        params: z.object({ projectId: z.string().uuid() }),
        query: DeploymentQuerySchema.omit({ projectId: true }),
    }),
    DeploymentController.getDeployments.bind(DeploymentController),
);

// Get single deployment
deploymentRouter.get(
    "/projects/:projectId/deployments/:deploymentId",
    authenticateToken,
    validateParams(
        z.object({
            projectId: z.string().uuid(),
            deploymentId: z.string().uuid(),
        }),
    ),
    DeploymentController.getDeployment.bind(DeploymentController),
);

// Cancel deployment
deploymentRouter.post(
    "/deployments/:deploymentId/cancel",
    authenticateToken,
    validateMultiple({
        params: z.object({ deploymentId: z.string().uuid() }),
        body: CancelDeploymentSchema.omit({ deploymentId: true }).partial(),
    }),
    DeploymentController.cancelDeployment.bind(DeploymentController),
);

// Rollback to previous deployment
deploymentRouter.post(
    "/projects/:projectId/deployments/rollback",
    authenticateToken,
    validateMultiple({
        params: z.object({ projectId: z.string().uuid() }),
        body: RollbackDeploymentSchema.omit({ projectId: true }),
    }),
    DeploymentController.rollbackDeployment.bind(DeploymentController),
);

// Get deployment logs
deploymentRouter.get(
    "/deployments/:deploymentId/logs",
    authenticateToken,
    validateMultiple({
        params: z.object({ deploymentId: z.string().uuid() }),
        query: z.object({
            since: z.coerce.date().optional(),
            limit: z.coerce.number().int().min(1).max(1000).default(100),
            level: z.enum(["INFO", "WARN", "ERROR", "DEBUG"]).optional(),
        }),
    }),
    DeploymentController.getDeploymentLogs.bind(DeploymentController),
);

// ==================== CONTROLLER EXAMPLES ====================

class ProjectController {
    async createProject(req: Request, res: Response, next: NextFunction) {
        try {
            // Data is already validated and typed!
            const projectData = getValidatedData<CreateProjectDTO>(req);

            // projectData is fully typed with all Zod transformations applied
            console.log("Creating project:", projectData.name);

            const project = await projectService.createProject(projectData);

            res.status(201).json({
                success: true,
                data: project,
            });
        } catch (error) {
            next(error);
        }
    }

    async getAllProjects(req: Request, res: Response, next: NextFunction) {
        try {
            const queryParams = getValidatedData<ProjectQueryDTO>(req);

            // All query params are validated and converted to correct types
            const { projects, total } = await projectService.getAllProjects(
                req.user!.id, // From authenticateToken middleware
                queryParams,
            );

            res.json({
                success: true,
                data: projects,
                pagination: {
                    page: queryParams.page,
                    limit: queryParams.limit,
                    total,
                    totalPages: Math.ceil(total / queryParams.limit),
                },
            });
        } catch (error) {
            next(error);
        }
    }

    async getProject(req: Request, res: Response, next: NextFunction) {
        try {
            const { projectId } = req.params as { projectId: string };

            const project = await projectService.getProject(projectId, req.user!.id);

            if (!project) {
                throw new AppError("Project not found", 404);
            }

            res.json({
                success: true,
                data: project,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateProject(req: Request, res: Response, next: NextFunction) {
        try {
            const { projectId } = req.params as { projectId: string };
            const updateData = getValidatedData<Partial<UpdateProjectDTO>>(req);

            const project = await projectService.updateProject(projectId, updateData);

            res.json({
                success: true,
                data: project,
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteProject(req: Request, res: Response, next: NextFunction) {
        try {
            const { projectId } = req.params as { projectId: string };

            await projectService.deleteProject(projectId, req.user!.id);

            res.json({
                success: true,
                message: "Project deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    }
}

class DeploymentController {
    async createDeployment(req: Request, res: Response, next: NextFunction) {
        try {
            const { projectId } = req.params as { projectId: string };
            const deploymentData = getValidatedData<Omit<CreateDeploymentDTO, "projectId">>(req);

            // Merge projectId from params
            const fullDeploymentData: CreateDeploymentDTO = {
                ...deploymentData,
                projectId,
            };

            const deployment = await deploymentService.createDeployment(fullDeploymentData);

            res.status(201).json({
                success: true,
                data: deployment,
            });
        } catch (error) {
            next(error);
        }
    }

    async getDeployments(req: Request, res: Response, next: NextFunction) {
        try {
            const { projectId } = req.params as { projectId: string };
            const queryParams = req.query;

            const { deployments, total } = await deploymentService.getDeployments(projectId, queryParams);

            res.json({
                success: true,
                data: deployments,
                total,
            });
        } catch (error) {
            next(error);
        }
    }

    async getDeployment(req: Request, res: Response, next: NextFunction) {
        try {
            const { projectId, deploymentId } = req.params as {
                projectId: string;
                deploymentId: string;
            };

            const deployment = await deploymentService.getDeployment(deploymentId, projectId);

            if (!deployment) {
                throw new AppError("Deployment not found", 404);
            }

            res.json({
                success: true,
                data: deployment,
            });
        } catch (error) {
            next(error);
        }
    }

    async cancelDeployment(req: Request, res: Response, next: NextFunction) {
        try {
            const { deploymentId } = req.params as { deploymentId: string };
            const { reason } = req.body as { reason?: string };

            await deploymentService.cancelDeployment(deploymentId, reason);

            res.json({
                success: true,
                message: "Deployment cancelled successfully",
            });
        } catch (error) {
            next(error);
        }
    }

    async rollbackDeployment(req: Request, res: Response, next: NextFunction) {
        try {
            const { projectId } = req.params as { projectId: string };
            const { targetDeploymentId } = req.body as { targetDeploymentId: string };

            const deployment = await deploymentService.rollbackDeployment(projectId, targetDeploymentId);

            res.json({
                success: true,
                data: deployment,
                message: "Rollback initiated successfully",
            });
        } catch (error) {
            next(error);
        }
    }

    async getDeploymentLogs(req: Request, res: Response, next: NextFunction) {
        try {
            const { deploymentId } = req.params as { deploymentId: string };
            const { since, limit, level } = req.query as {
                since?: Date;
                limit: number;
                level?: string;
            };

            const logs = await deploymentService.getDeploymentLogs(deploymentId, { since, limit, level });

            res.json({
                success: true,
                data: logs,
            });
        } catch (error) {
            next(error);
        }
    }
}

// ==================== MAIN APP SETUP ====================

const app = express();

app.use(express.json());

// Mount routers
app.use("/api/projects", projectRouter);
app.use("/api", deploymentRouter);

export default app;
