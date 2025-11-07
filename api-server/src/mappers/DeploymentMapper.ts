import { IDeployment } from "../models/Deployment.js";

interface toDeploymentResponseDTO {
    deployment: {
        _id: string;
        project: string;
        commitHash: string;
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
interface toDeploymentsResponseDTO {
    deployments: toDeploymentResponseDTO["deployment"][];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
export class DeploymentMapper {
    static toDeploymentResponse(deployment: IDeployment): toDeploymentResponseDTO {
        return {
            deployment: {
                _id: deployment._id,
                project: deployment.project.toString(),
                commitHash: deployment.commit_hash,
                userId: deployment.userId.toString(),
                status: deployment.status,
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
        return {
            deployments: deployments.map((dep) => this.toDeploymentResponse(dep).deployment),
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
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
}
