import { Types } from "mongoose";
import { IDeployment } from "../models/Deployment.js";
import { IProject } from "../models/Projects.js";

interface toDeploymentResponseDTO {
	deployment: {
		_id: string;
		project: string | { name: string, _id: string, subdomain: string, branch: string };
		commit: { id: string, msg: string };
		userId: string;
		status: "NOT_STARTED" | "QUEUED" | "BUILDING" | "READY" | "FAILED" | "CANCELLED";
		performance: {
			installTime: number;
			buildTime: number;
			totalDuration: number;
		};
		overWrite: boolean;
		completedAt: Date;
		s3Path: string;
		errorMessage?: string;
		createdAt: Date;
		updatedAt: Date;
	};
}
interface toDeploymentFilesResponse {
	deployment: {
		_id: string;
		fileStructure?: {
			totalSize: number;
			files: {
				name: string;
				size: number;
			}[]
		}
	}
}
interface toDeploymentsResponseDTO {
	deployments: toDeploymentResponseDTO["deployment"][];
	pagination: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
}
const ar = [
	"NOT_STARTED",
	"QUEUED",
	"BUILDING",
	"READY",
	"FAILED",
	"CANCELLED"
]
export class DeploymentMapper {
	static toDeploymentResponse(deployment: IDeployment): toDeploymentResponseDTO {
		return {
			deployment: {
				_id: deployment._id + "___" + Math.random().toString(36).slice(2, 12),
				project: this.isPopulatedObject(deployment.project)
					? {
						name: (deployment.project as any).name,
						_id: (deployment.project as any)._id,
						subdomain: (deployment.project as any).subdomain,
						branch: (deployment.project as any).branch
					}
					: deployment.project.toString(),
				commit: { msg: deployment.commit_hash.split("||")[1], id: deployment.commit_hash.split("||")[0] },
				userId: deployment.userId.toString(),
				status: ar[Math.floor(Math.random() * ar.length)] as any,
				performance: {
					installTime: deployment.install_ms,
					buildTime: deployment.build_ms,
					totalDuration: deployment.duration_ms,
				},
				s3Path: deployment.s3Path,
				overWrite: deployment.overWrite,
				completedAt: deployment.complete_at,
				errorMessage: deployment.error_message,
				createdAt: deployment.createdAt,
				updatedAt: deployment.updatedAt,
			},
		};
	}

	static toDeploymentsResponse(deployments: IDeployment[], total: number, page: number, limit: number): toDeploymentsResponseDTO {
		const newDe = [...deployments, ...deployments, ...deployments, ...deployments, ...deployments, ...deployments, ...deployments, ...deployments, ...deployments,]

		return {
			deployments: newDe.map((dep) => this.toDeploymentResponse(dep).deployment),
			pagination: {
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit),
			},
		};
	}
	static isPopulatedObject(project: any): boolean {
		return 'name' in project && 'branch' in project;
	}
	static toDeploymentSummary(deployment: IDeployment) {
		// INCLUDE TYPES
		return {
			id: deployment._id,
			commitHash: deployment.commit_hash,
			status: deployment.status,
			createdAt: deployment.createdAt,
		};
	}
	static toDeploymentFilesResponse(deployment: IDeployment): toDeploymentFilesResponse {

		return {
			deployment: {
				_id: deployment._id,
				fileStructure: {
					totalSize: (deployment.file_structure?.totalSize || 0),
					files: (deployment.file_structure?.files.map((f) => ({
						name: f.name.replace(/\\/g, "/"),
						size: f.size
					})) || [])
				}
			},
		};
	}
}
