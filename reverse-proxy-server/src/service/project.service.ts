import { IProjectRepo } from "../interfaces/repository/IProjectRepo.js";
import { IProjectService } from "../interfaces/service/IProjectService.js";
import { IProject } from "../models/Project.js";
import { projectRepo } from "../repository/project.repo.js";
import AppError from "../utils/AppError.js";

class ProjectService implements IProjectService {
	private projectRepository: IProjectRepo;
	constructor(projectRepo: IProjectRepo) {
		this.projectRepository = projectRepo;
	}

	async findProjectBySlug(slug: string): Promise<IProject | null> {
		const project = await this.projectRepository.getProjectBySlug(slug)
		return project
	}
}


export const projectService = new ProjectService(projectRepo)