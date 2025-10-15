import { DeploymentStatus, IDeployment } from "../../models/Deployment.js";

export interface IDeploymentRepository {
    createD(deploymentData: Partial<IDeployment>): Promise<IDeployment | null>;
    findAllD(userId: string): Promise<IDeployment[]>;
    findProjectD(userId: string, projectId: string): Promise<IDeployment[]>;

    updateD(projectId: string, deploymentId: string, userId: string, updateData: Partial<IDeployment>): Promise<IDeployment | null>;

    deleteD(projectId: string, deploymentId: string, userId: string): Promise<number>;

    updateStatusD(projectId: string, deploymentId: string, userId: string, status: DeploymentStatus): Promise<IDeployment | null>;
    findD(id: string): Promise<IDeployment | null>;
}
