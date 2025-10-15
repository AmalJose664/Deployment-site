import { Request, Response, NextFunction } from "express";
import { IProjectController } from "../interfaces/controller/IProjectController.js";
import ProjectService from "../services/project.service.js";
import { HTTP_STATUS_CODE } from "../utils/statusCodes.js";
import { CreateProjectDTO, ProjectQueryScheme } from "../dtos/project.dto.js";

class ProjectController implements IProjectController {
    private projectService: ProjectService;

    constructor(projectService: ProjectService) {
        this.projectService = projectService;
    }
    async createProject(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dto = req.body as CreateProjectDTO;
            const user = req.user?.id;

            const dbResult = await this.projectService.createProject(dto, user || "");
            res.json(dbResult);
        } catch (error) {
            next(error);
        }
    }
    async getAllProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id;
            const query = ProjectQueryScheme.parse(req.query);

            const result = await this.projectService.getAllProjects(userId || "", query.page, query.limit, query.status, query.search);
            console.log(result, "<<<");
            res.status(HTTP_STATUS_CODE.OK).json({ message: "Ok" });
        } catch (err) {
            next(err);
        }
    }

    async __getProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const projectId = req.params.id;
            const project = await this.projectService.__getProjectById(projectId);

            res.json({ project: project });
        } catch (error) {
            next(error);
        }
    }
}

export default ProjectController;
