import { Types } from "mongoose";
import { IProject } from "../models/Projects.js";
import { IUser } from "../models/User.js";

interface ProjectResponseDTO {
    project: {
        _id: string;
        user: string | { _id: string; name: string; email: string; profileImage: string };
        name: string;
        repoURL: string;
        subdomain: string;
        buildCommand: string;
        installCommand: string;
        techStack: string;
        branch: string;
        rootDir: string;
        outputDirectory: string;
        currentDeployment: string | null;
        tempDeployment: string | null;
        lastDeployment: string | null;
        isDisabled: boolean;
        env: {
            name: string;
            value: string;
        }[];
        lastDeployedAt?: Date;
        status: "NOT_STARTED" | "QUEUED" | "BUILDING" | "READY" | "FAILED" | "CANCELLED";
        deployments?: string[];
        createdAt: Date | string;
    };
}
interface ProjectsResponseDTO {
    projects: ProjectResponseDTO["project"][];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
type ProjectResponseWithUserDTO = Omit<IProject, "user"> & {
    user: any;
};
export class ProjectMapper {
    static toProjectResponse(project: ProjectResponseWithUserDTO): ProjectResponseDTO {
        return {
            project: {
                _id: project._id,
                name: project.name,
                branch: project.branch,
                buildCommand: project.buildCommand,
                env: project.env.map((e) => ({ name: e.name, value: e.value })),
                installCommand: project.installCommand,
                outputDirectory: project.outputDirectory,
                repoURL: project.repoURL,
                techStack: project.techStack || "NA",
                rootDir: project.rootDir,
                status: project.status,
                currentDeployment: project.currentDeployment,
                tempDeployment: project.tempDeployment,
                lastDeployment: project.lastDeployment,
                subdomain: project.subdomain,
                isDisabled: project.isDisabled,
                user: this.isPopulatedObject(project.user, ["profileImage", "email", "name"])
                    ? {
                          _id: project.user._id,
                          name: project.user.name,
                          email: project.user.email,
                          profileImage: project.user.profileImage,
                      }
                    : project.user.toString(),
                deployments: project.deployments?.map((d) => d.toString()),
                lastDeployedAt: project.lastDeployedAt,
                createdAt: project.createdAt,
            },
        };
    }
    static toProjectsResponse(projects: IProject[], total: number, page: number, limit: number): ProjectsResponseDTO {
        return {
            projects: projects.map((project) => ProjectMapper.toProjectResponse(project).project),
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    static isPopulatedObject(object: any, fields: string[]): boolean {
        return object && fields.every((f) => f in object);
        // return 'name' in object && 'branch' in object;
    }
}
