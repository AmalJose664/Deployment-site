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
    findProject(projectId: string, userId: string): Promise<IProject | null>;
    changeStatus(projectData: string, userId: string, status: ProjectStatus): Promise<IProject | null>;
    deleteProject(projectId: string): Promise<void>;
    __findProject(projectId: string): Promise<IProject | null>;
}
