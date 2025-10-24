import { Types } from "mongoose";
import { IProjectRepository } from "../interfaces/repository/IProjectRepository.js";
import { IProject, Project, ProjectStatus } from "../models/Projects.js";
import { IUser, User } from "../models/User.js";
import { BaseRepository } from "./base/base.repository.js";

class ProjectRepository extends BaseRepository<IProject> implements IProjectRepository {
	constructor() {
		super(Project);
	}

	async createProject(projectData: Partial<IProject>): Promise<IProject | null> {
		const project = new Project(projectData);
		console.log(project, projectData, "<<<<<<<")
		const savedProject = await project.save();

		return savedProject;
	}
	async findProject(projectId: string, userId: string, userFill?: boolean): Promise<IProject | null> {
		if (userFill) {
			return await Project.findOne({ _id: projectId, user: userId }).populate("user", "name email profileImage")
		}
		return await Project.findOne({ _id: projectId, user: userId })
	}
	async getAllProjects(
		userId: string,
		page: number,
		limit: number,
		status?: ProjectStatus,
		search?: string,
	): Promise<{ projects: IProject[]; total: number }> {
		const query: any = { user: userId };
		if (search) {
			query.$or = [{ name: { $regex: search, $options: "i" } }, { subdomain: { $regex: search, $options: "i" } }];
		}
		if (status) {
			query.status = { $eq: status };
		}

		const projects = await this.findMany(query)
			.limit(limit)
			.skip((page - 1) * limit)
			.exec();
		const total = await this.count(query);

		return { projects, total };
	}

	async deleteProject(projectId: string, userId: string): Promise<IProject | null> {
		return await Project.findOneAndUpdate({ _id: projectId, user: userId }, { isDeleted: true }, { new: true });

	}
	async updateProject(projectId: string, userId: string, updateData: Partial<IProject>): Promise<IProject | null> {
		return await Project.findOneAndUpdate({ _id: projectId, user: userId }, { $set: { ...updateData } }, { new: true })
	}

	async pushToDeployments(projectId: string, userId: string, newDeployment: string | Types.ObjectId): Promise<IProject | null> {
		return await Project.findOneAndUpdate({ _id: projectId, user: userId }, { $addToSet: { deployments: newDeployment } }, { new: true })
	}

	async pullDeployments(projectId: string, userId: string, deployment: string | Types.ObjectId): Promise<IProject | null> {
		return await Project.findOneAndUpdate({ _id: projectId, user: userId }, { $pull: { deployments: deployment } }, { new: true })
	}
	async __findProject(projectId: string): Promise<IProject | null> {
		// container
		return await Project.findOne({ _id: projectId });
	}
	async __updateProject(projectId: string, updateData: Partial<IProject>): Promise<IProject | null> {
		// container
		return await Project.findOneAndUpdate({ _id: projectId }, { $set: { ...updateData } }, { new: true })
	}
}
export default ProjectRepository;
