import { Types } from "mongoose";
import { IProjectRepository } from "../interfaces/repository/IProjectRepository.js";
import { IUserRepository } from "../interfaces/repository/IUserRepository.js";
import { IProjectService } from "../interfaces/service/IProjectService.js";
import { IProject, ProjectStatus } from "../models/Projects.js";
import { IUser } from "../models/User.js";
import { generateSlug } from "random-word-slugs";
import { CreateProjectDTO, QueryProjectDTO } from "../dtos/project.dto.js";
import AppError from "../utils/AppError.js";
import { HTTP_STATUS_CODE } from "../utils/statusCodes.js";

class ProjectService implements IProjectService {
    private projectRepository: IProjectRepository;
    private userRepository: IUserRepository;

    constructor(projectRepo: IProjectRepository, userRepo: IUserRepository) {
        this.projectRepository = projectRepo;
        this.userRepository = userRepo;
    }
    async createProject(dto: CreateProjectDTO, userId: string): Promise<IProject | null> {
        const projectData: Partial<Omit<IProject, keyof Document>> = {
            name: dto.name,
            user: new Types.ObjectId(userId),
            repoURL: dto.repoURL,
            branch: dto.branch,
            buildCommand: dto.buildCommand,
            env: dto.env || [],
            installCommand: dto.installCommand,
            outputDirectory: dto.outputDirectory,
            rootDir: dto.rootDir,
            subdomain: `${generateSlug()}-${Math.floor(Math.random() * 10000)}`,
        };

        const user = await this.userRepository.findByUserId(userId);
        if (!user) {
            throw new AppError("User not found", HTTP_STATUS_CODE.NOT_FOUND);
        }
        if (user?.projects > user?.plan.maxProjects) {
            throw new AppError("Reached maximum projects", HTTP_STATUS_CODE.SERVICE_UNAVAILABLE);
        }
        const newProject = await this.projectRepository.createProject(projectData);
        await this.userRepository.incrementProjects(user.id);

        return newProject;
    }

    async getAllProjects(userId: string, query: QueryProjectDTO): Promise<{ projects: IProject[]; total: number }> {
        const result = await this.projectRepository.getAllProjects(userId, query);
        return result;
    }
    async getProjectById(id: string, userId: string, userFill: boolean): Promise<IProject | null> {
        const user = await this.userRepository.findByUserId(userId);
        if (!user) {
            throw new AppError("User not found", 404);
        }
        const project = await this.projectRepository.findProject(id, userId, userFill);

        return project;
    }

    async deleteProject(projectId: string, userId: string): Promise<boolean> {
        const user = this.userRepository.findByUserId(userId);
        if (!user) {
            throw new AppError("User not found, Cant delete project", 404);
        }
        const result = await this.projectRepository.deleteProject(projectId, userId);
        return result?.isDeleted ?? false;
    }

    async __getProjectById(id: string): Promise<IProject | null> {
        //container
        return await this.projectRepository.__findProject(id);
    }
    async __updateProjectById(projectId: string, updateData: Partial<IProject>): Promise<IProject | null> {
        //container
        const status = updateData.status as string as ProjectStatus;
        return await this.projectRepository.__updateProject(projectId, {
            status,
            ...(updateData.techStack && {
                techStack: updateData.techStack,
            }),
        });
    }
}

export default ProjectService;
