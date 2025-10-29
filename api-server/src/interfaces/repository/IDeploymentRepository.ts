import { QueryDeploymentDTO } from "../../dtos/deployment.dto.js";
import { DeploymentStatus, IDeployment } from "../../models/Deployment.js";

export interface IDeploymentRepository {
	createDeployment(deploymentData: Partial<IDeployment>): Promise<IDeployment | null>;
	findDeploymentById(id: string, userId: string): Promise<IDeployment | null>

	findAllDeployments(userId: string, query: QueryDeploymentDTO): Promise<{ deployments: IDeployment[], total: number }>;
	findProjectDeployments(userId: string, projectId: string, query: QueryDeploymentDTO): Promise<{ deployments: IDeployment[], total: number }>;

	deleteDeployment(projectId: string, deploymentId: string, userId: string): Promise<number>;
	__findDeployment(id: string): Promise<IDeployment | null>;


	__updateDeployment(projectId: string, deploymentId: string, updateData: Partial<IDeployment>): Promise<IDeployment | null>;
}
