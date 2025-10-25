import { Request, Response, NextFunction } from "express";
import { IProjectController } from "../interfaces/controller/IProjectController.js";
import ProjectService from "../services/project.service.js";
import { HTTP_STATUS_CODE } from "../utils/statusCodes.js";
import { CreateProjectDTO, QueryProjectDTO } from "../dtos/project.dto.js";
import { ProjectMapper } from "../mappers/ProjectMapper.js";

class ProjectController implements IProjectController {
	private projectService: ProjectService;

	constructor(projectService: ProjectService) {
		this.projectService = projectService;
	}
	async createProject(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const dto = req.validatedBody as CreateProjectDTO;
			const user = req.user?.id;

			const dbResult = await this.projectService.createProject(dto, user || "");

			res.status(HTTP_STATUS_CODE.CREATED).json(dbResult);
		} catch (error) {
			next(error);
		}
	}
	async getAllProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user?.id as string

			const query = req.validatedQuery as unknown as QueryProjectDTO

			const result = await this.projectService.getAllProjects(userId, query);
			const response = ProjectMapper.toProjectsResponse(result.projects, result.total, query.page, query.limit)

			res.status(HTTP_STATUS_CODE.OK).json(response);
		} catch (err) {
			next(err);
		}
	}
	async getProject(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user?.id as string
			const projectId = req.params.projectId
			const userFill = !!req.query.user

			const result = await this.projectService.getProjectById(projectId, userId, userFill);
			if (result) {

				const response = ProjectMapper.toProjectResponse(result, userFill)
				res.status(HTTP_STATUS_CODE.OK).json(response);
				return
			}
			res.status(HTTP_STATUS_CODE.NOT_FOUND).json({ project: null });

		} catch (err) {
			next(err);
		}
	}
	async deleteProject(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user?.id as string
			const projectId = req.params.projectId

			const result = await this.projectService.deleteProject(projectId, userId);

			res.status(HTTP_STATUS_CODE.NO_CONTENT).json({ deleted: result });

		} catch (err) {
			next(err);
		}
	}





	async __getProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const projectId = req.params.id;
			const project = await this.projectService.__getProjectById(projectId);
			if (project) {
				const response = ProjectMapper.toProjectResponse(project)
				res.json(response);
				return
			}
			res.json({ project: null })
		} catch (error) {
			next(error);
		}
	}
}

export default ProjectController;
