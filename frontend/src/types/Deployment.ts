import { ProjectStatus } from "./Project";
import { User } from "./User";

export interface Deployment {
	_id: string;
	project: string;
	commitHash: string;
	userId: string;
	status: ProjectStatus;
	performance: {
		installTime: number;
		buildTime: number;
		totalDuration: number;
	}
	overWrite: boolean;
	completedAt: Date;
	s3Path: string;
	errorMessage?: string;
	createdAt: Date;
	updatedAt: Date;
}