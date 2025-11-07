import { Model } from "mongoose";
import { IProjectRepo } from "../interfaces/repository/IProjectRepo.js";
import { IProject, Project } from "../models/Project.js";

class ProjectRepository implements IProjectRepo {
	private model: Model<IProject>
	constructor(projectModel: Model<IProject>) {
		this.model = projectModel
	}

	async getProjectBySlug(slug: string): Promise<IProject | null> {
		return await this.model.findOne({ subdomain: slug })
	}
}



export const projectRepo = new ProjectRepository(Project)