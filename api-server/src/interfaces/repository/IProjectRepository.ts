import { Types } from "mongoose";
import { IProject, ProjectStatus } from "../../models/Projects.js";
import { IUser } from "../../models/User.js";
import { QueryProjectDTO } from "../../dtos/project.dto.js";

export interface IProjectRepository {
	createProject(project: Partial<IProject>): Promise<IProject | null>;

	getAllProjects(userId: string, query: QueryProjectDTO): Promise<{ projects: IProject[]; total: number }>;
	findProject(projectId: string, userId: string, userFill?: boolean): Promise<IProject | null>;
	deleteProject(projectId: string, userId: string): Promise<IProject | null>;
	updateProject(projectId: string, userId: string, updateData: Partial<IProject>): Promise<IProject | null>;
	pushToDeployments(prjectId: string, userId: string, newDeployment: string | Types.ObjectId): Promise<IProject | null>;
	pullDeployments(projectId: string, userId: string, newDeployment: string | Types.ObjectId, backUpDeployment: string | null): Promise<IProject | null>;

	__findProject(projectId: string): Promise<IProject | null>;
	__updateProject(projectId: string, updateData: Partial<IProject>): Promise<IProject | null>;
}
