import NodeCache from "node-cache";
import { IProjectRepo } from "../interfaces/repository/IProjectRepo.js";
import { IProjectService } from "../interfaces/service/IProjectService.js";
import { IProject } from "../models/Project.js";
import { projectRepo } from "../repository/project.repo.js";
import AppError from "../utils/AppError.js";

class ProjectService implements IProjectService {
	private projectRepository: IProjectRepo;
	private projectCache: NodeCache
	constructor(projectRepo: IProjectRepo, projectCache: NodeCache) {
		this.projectRepository = projectRepo;
		this.projectCache = projectCache
	}

	async findProjectBySlug(slug: string): Promise<IProject | null> {
		const dataFromCache = this.projectCache.get(slug) || null
		console.log(dataFromCache, "<<<<< ----")
		if (dataFromCache) {
			console.log("from cache")
			return dataFromCache as IProject
		}

		console.log("db calls ====>")

		const project = await this.projectRepository.getProjectBySlug(slug)
		this.projectCache.set(slug, project)
		return project
	}
}


export const projectService = new ProjectService(projectRepo, new NodeCache({
	stdTTL: 300,
	checkperiod: 60 * 3
})
)