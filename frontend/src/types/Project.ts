import { User } from "./User";

export enum ProjectStatus {
	NOT_STARTED = "NOT_STARTED",
	BUILDING = "BUILDING",
	READY = "READY",
	FAILED = "FAILED",
	CANCELED = "CANCELLED",
}
export interface Project {
	_id: string;
	user: User | string;
	name: string;
	repoURL: string;
	subdomain: string;
	buildCommand: string;
	installCommand: string;
	branch: string;
	rootDir: string;
	outputDirectory: string;
	techStack: string;
	env: {
		name: string
		value: string
	}[];
	lastDeployedAt?: Date;
	status: string;
	deployments?: string[];
	isDeleted: boolean;

	createdAt: Date;
	updatedAt: Date;
}

export type ProjectFormInput = {
	name: string;
	repoURL: string;
	buildCommand?: string;
	installCommand?: string;
	branch?: string;
	rootDir?: string;
	outputDirectory?: string;
	env?: {
		name: string
		value: string
	}[];
}

