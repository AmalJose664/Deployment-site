import { CreateProjectDTO } from "../../dtos/project.dto.js";
import { IProject, ProjectStatus } from "../../models/Projects.js";
import { IUser } from "../../models/User.js";

export interface IProjectService {
    createProject(projectData: CreateProjectDTO, userId: string): Promise<IProject | null>;

    getAllProjects(
        userId: string,
        page: number,
        limit: number,
        status?: ProjectStatus,
        search?: string,
    ): Promise<{ projects: IProject[]; total: number }>;
    getProjectById(id: string, userId: string): Promise<IProject | null>;
    deleteProject(projectId: string): Promise<void>;
    __getProjectById(id: string): Promise<IProject | null>;
}
