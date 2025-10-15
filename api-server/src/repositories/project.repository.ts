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
        const savedProject = await project.save();

        return savedProject;
    }
    async findProject(projectId: string, userId: string): Promise<IProject | null> {
        return await Project.findOne({ _id: projectId, user: userId });
    }
    async getAllProjects(
        userId: string,
        page: number,
        limit: number,
        status?: ProjectStatus,
        search?: string,
    ): Promise<{ projects: IProject[]; total: number }> {
        const query: any = {};
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
    async changeStatus(projectId: string, userId: string, status: ProjectStatus): Promise<IProject | null> {
        return await Project.findOneAndUpdate({ _id: projectId, user: userId }, { $set: { status } }, { new: true });
    }
    async deleteProject(projectId: string): Promise<void> {
        await this.findOneAndUpdate({ id: projectId }, { isDeleted: true });
    }

    async __findProject(projectId: string): Promise<IProject | null> {
        // container
        return await Project.findOne({ _id: projectId });
    }
}
export default ProjectRepository;
