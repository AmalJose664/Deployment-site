import { CreateProjectDTO, QueryProjectDTO } from "../../dtos/project.dto.js";
import { IProject, ProjectStatus } from "../../models/Projects.js";
import { IUser } from "../../models/User.js";

export type options = {
	updateStatusOnlyIfNoCurrentDeployment?: boolean
}
export interface IProjectService {
	createProject(projectData: CreateProjectDTO, userId: string): Promise<IProject | null>;

	getAllProjects(userId: string, query: QueryProjectDTO): Promise<{ projects: IProject[]; total: number }>;
	getProjectById(id: string, userId: string, include?: string): Promise<IProject | null>;
	updateProject(id: string, userId: string, data: Partial<IProject>): Promise<IProject | null>;
	deleteProject(projectId: string, userId: string): Promise<boolean>;
	__getProjectById(id: string): Promise<IProject | null>;
	__updateProjectById(projectId: string, updateData: Partial<IProject>, options?: options): Promise<IProject | null>
}
