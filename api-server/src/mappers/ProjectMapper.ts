import { Types } from "mongoose";
import { IProject } from "../models/Projects.js";
import { IUser } from "../models/User.js";

interface ProjectResponseDTO {
	project: {
		_id: string;
		user: any//string | Types.ObjectId | { _id: string, name: string; email: string, profileImage: string };
		name: string;
		repoURL: string;
		subdomain: string;
		buildCommand: string;
		installCommand: string;
		techStack: string;
		branch: string;
		rootDir: string;
		outputDirectory: string;
		env: {
			name: string;
			value: string
		}[];
		lastDeployedAt?: Date;
		status: "NOT_STARTED" | "QUEUED" | "BUILDING" | "READY" | "FAILED" | "CANCELLED";
		deployments?: string[];
	}

}
interface ProjectsResponseDTO {
	projects: ProjectResponseDTO['project'][],
	pagination: {
		total: number;
		page: number,
		limit: number,
		totalPages: number
	}

}
type ProjectResponseWithUserDTO = Omit<IProject, 'user'> & {
	user: any
};
export class ProjectMapper {

	static toProjectResponse(project: ProjectResponseWithUserDTO, userFill: boolean = false): ProjectResponseDTO {
		return {
			project: {
				_id: project._id,
				name: project.name,
				branch: project.branch,
				buildCommand: project.buildCommand,
				env: project.env.map(e => ({ name: e.name, value: e.value })),
				installCommand: project.installCommand,
				outputDirectory: project.outputDirectory,
				repoURL: project.repoURL,
				techStack: project.techStack || "NA",
				rootDir: project.rootDir,
				status: project.status,
				subdomain: project.subdomain,
				user: (!userFill ? project.user.toString() : {
					_id: project.user._id,
					name: project.user.name,
					email: project.user.email,
					profileImage: project.user.profileImage
				}),
				deployments: project.deployments?.map(d => d.toString()),
				lastDeployedAt: project.lastDeployedAt
			}
		}
	}
	static toProjectsResponse(projects: IProject[], total: number, page: number,
		limit: number): ProjectsResponseDTO {
		return {
			projects: projects.map((project) => ProjectMapper.toProjectResponse(project).project),
			pagination: {
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit)
			}
		}
	}
}