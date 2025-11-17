import { Request, Response, NextFunction } from "express";
import { IProjectController } from "../interfaces/controller/IProjectController.js";
import ProjectService from "../services/project.service.js";
import { HTTP_STATUS_CODE } from "../utils/statusCodes.js";
import { CreateProjectDTO, QueryProjectDTO } from "../dtos/project.dto.js";
import { ProjectMapper } from "../mappers/ProjectMapper.js";
import AppError from "../utils/AppError.js";

class ProjectController implements IProjectController {
	private projectService: ProjectService;

	constructor(projectService: ProjectService) {
		this.projectService = projectService;
	}
	async createProject(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const dto = req.validatedBody as CreateProjectDTO;
			const user = req.user?.id;

			// await new Promise(reso => setTimeout(reso, 4000))
			// res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error: "something" })
			// return

			const dbResult = await this.projectService.createProject(dto, user || "");
			if (!dbResult) {
				throw new AppError("Cannot create project", HTTP_STATUS_CODE.BAD_REQUEST);
			}
			const response = ProjectMapper.toProjectResponse(dbResult);

			res.status(HTTP_STATUS_CODE.CREATED).json(response);
		} catch (error) {
			next(error);
		}
	}
	async getAllProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user?.id as string;

			const query = req.validatedQuery as unknown as QueryProjectDTO;

			const result = await this.projectService.getAllProjects(userId, query);
			const response = ProjectMapper.toProjectsResponse(result.projects, result.total, query.page, query.limit);

			res.status(HTTP_STATUS_CODE.OK).json(response);
		} catch (err) {
			next(err);
		}
	}
	async getProject(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user?.id as string;
			const projectId = req.params.projectId;
			const userFill = !!req.query.user;

			const result = await this.projectService.getProjectById(projectId, userId, userFill);
			if (!result) {
				res.status(HTTP_STATUS_CODE.NOT_FOUND).json({ project: null });
				return;
			}
			const response = ProjectMapper.toProjectResponse(result, userFill);
			res.status(HTTP_STATUS_CODE.OK).json(response);
		} catch (err) {
			next(err);
		}
	}
	async updateProject(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {

			const userId = req.user?.id as string;
			const projectId = req.params.projectId;
			const dto = req.validatedBody as Omit<CreateProjectDTO, "repoURL">;

			const result = await this.projectService.updateProject(projectId, userId, dto)
			if (!result) {
				res.status(HTTP_STATUS_CODE.NOT_FOUND).json({ project: null });
				return;
			}
			const response = ProjectMapper.toProjectResponse(result);
			res.status(HTTP_STATUS_CODE.OK).json(response);
		} catch (err) {
			next(err);
		}
	}
	async deleteProject(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user?.id as string;
			const projectId = req.params.projectId;

			const result = await this.projectService.deleteProject(projectId, userId);
			console.log(result)

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
				const response = ProjectMapper.toProjectResponse(project);
				res.json(response);
				return;
			}
			res.json({ project: null });
		} catch (error) {
			next(error);
		}
	}
}

export default ProjectController;
