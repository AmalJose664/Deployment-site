import { Types } from "mongoose";
import { IProject, ProjectStatus } from "../../models/Projects.js";
import { IUser } from "../../models/User.js";

export interface IProjectRepository {
	createProject(project: Partial<IProject>): Promise<IProject | null>;

	getAllProjects(
		userId: string,
		page: number,
		limit: number,
		status?: ProjectStatus,
		search?: string,
	): Promise<{ projects: IProject[]; total: number }>;
	findProject(projectId: string, userId: string, userFill?: boolean): Promise<IProject | null>;
	deleteProject(projectId: string, userId: string): Promise<IProject | null>;
	updateProject(projectId: string, userId: string, updateData: Partial<IProject>): Promise<IProject | null>
	pushToDeployments(prjectId: string, userId: string, newDeployment: string | Types.ObjectId): Promise<IProject | null>
	pullDeployments(projectId: string, userId: string, newDeployment: string | Types.ObjectId): Promise<IProject | null>

	__findProject(projectId: string): Promise<IProject | null>;
	__updateProject(projectId: string, updateData: Partial<IProject>): Promise<IProject | null>
}
