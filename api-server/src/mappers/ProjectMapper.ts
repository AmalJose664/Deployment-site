import { IProject } from "../models/Projects.js";

interface ProjectResponseDTO {
	project: {
		_id: string;
		user: string;
		name: string;
		repoURL: string;
		subdomain: string;
		buildCommand: string;
		installCommand: string;
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
	total: number
}

export class ProjectMapper {

	static toProjectResponse(project: IProject): ProjectResponseDTO {
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
				rootDir: project.rootDir,
				status: project.status,
				subdomain: project.subdomain,
				user: project.user.toString(),
				deployments: project.deployments?.map(d => d.toString()),
				lastDeployedAt: project.lastDeployedAt
			}
		}
	}
	static toProjectsResponse(projects: IProject[], total: number): ProjectsResponseDTO {
		return {
			projects: projects.map((project) => ProjectMapper.toProjectResponse(project).project),
			total
		}
	}
}