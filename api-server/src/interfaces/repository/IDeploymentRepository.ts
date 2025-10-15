import { DeploymentStatus, IDeployment } from "../../models/Deployment.js";

export interface IDeploymentRepository {
	createDeployment(deploymentData: Partial<IDeployment>): Promise<IDeployment | null>;
	findAllDeployments(userId: string): Promise<IDeployment[]>;
	findProjectDeployments(userId: string, projectId: string): Promise<IDeployment[]>;
	deleteDeployment(projectId: string, deploymentId: string, userId: string): Promise<number>;
	__findDeployment(id: string): Promise<IDeployment | null>;


	__updateDeployment(projectId: string, deploymentId: string, updateData: Partial<IDeployment>): Promise<IDeployment | null>;
}
