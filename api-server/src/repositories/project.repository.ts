import { FilterQuery, Types } from "mongoose";
import { IProjectRepository } from "../interfaces/repository/IProjectRepository.js";
import { IProject, Project, ProjectStatus } from "../models/Projects.js";
import { IUser, User } from "../models/User.js";
import { BaseRepository } from "./base/base.repository.js";
import { QueryProjectDTO } from "../dtos/project.dto.js";

class ProjectRepository extends BaseRepository<IProject> implements IProjectRepository {
	constructor() {
		super(Project);
	}

	async createProject(projectData: Partial<IProject>): Promise<IProject | null> {
		const project = new Project(projectData);
		const savedProject = await project.save();
		return savedProject;
	}
	async findProject(projectId: string, userId: string, include?: string): Promise<IProject | null> {
		if (include?.includes("user")) {
			return await Project.findOne({ _id: projectId, user: userId, isDeleted: false }).populate("user", "name email profileImage");
		}
		return await Project.findOne({ _id: projectId, user: userId, isDeleted: false }); //
	}
	async findProjectsBySubdomain(subdomain: string): Promise<IProject[]> {
		return await Project.find({ subdomain, isDeleted: false }); //
	}

	async getAllProjects(userId: string, query: QueryProjectDTO): Promise<{ projects: IProject[]; total: number }> {
		const dbQuery: FilterQuery<IProject> = { user: userId, isDeleted: false };
		if (query.search) {
			dbQuery.$or = [{ name: { $regex: query.search, $options: "i" } }, { subdomain: { $regex: query.search, $options: "i" } }];
		}
		if (query.status) {
			dbQuery.status = { $eq: query.status };
		}
		let findQuery = this.findMany(dbQuery)
			.limit(query.limit)
			.skip((query.page - 1) * query.limit);
		if (query.include?.includes("user")) {
			findQuery = findQuery.populate("user", "name email profileImage");
		}
		const projects = await findQuery.sort("-_id").exec();
		const total = await this.count(dbQuery);
		return { projects, total };
	}

	async deleteProject(projectId: string, userId: string): Promise<IProject | null> {
		return await Project.findOneAndUpdate({ _id: projectId, user: userId }, { isDeleted: true }, { new: true });
	}
	async updateProject(projectId: string, userId: string, updateData: Partial<IProject>): Promise<IProject | null> {
		return await Project.findOneAndUpdate({ _id: projectId, user: userId }, { $set: { ...updateData } }, { new: true });
	}

	async pushToDeployments(projectId: string, userId: string, newDeployment: string | Types.ObjectId): Promise<IProject | null> {
		return await Project.findOneAndUpdate(
			{ _id: projectId, user: userId },
			{
				lastDeployedAt: new Date(),
				tempDeployment: newDeployment.toString(),
				lastDeployment: newDeployment.toString(),
				$addToSet: { deployments: newDeployment }
			},
			{ new: true },
		);
	}

	async pullDeployments(
		projectId: string,
		userId: string,
		deployment: string | Types.ObjectId,
		backUpDeployment: string | null,
	): Promise<IProject | null> {
		return await Project.findOneAndUpdate(
			{ _id: projectId, user: userId },
			{
				currentDeployment: backUpDeployment,
				$pull: { deployments: deployment },
			},
			{ new: true },
		);
	}
	async __findProject(projectId: string): Promise<IProject | null> {
		// container
		return await Project.findOne({ _id: projectId });
	}
	async __updateProject(projectId: string, updateData: Partial<IProject>): Promise<IProject | null> {
		// container
		return await Project.findOneAndUpdate({ _id: projectId }, { $set: { ...updateData } }, { new: true });
	}
}
export default ProjectRepository;
