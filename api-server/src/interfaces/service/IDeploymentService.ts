import { DeploymentStatus, IDeployment } from "../../models/Deployment.js";
import { IProject } from "../../models/Projects.js";

export interface IDeploymentService {
	newDeployment(deploymentData: Partial<IDeployment>, userId: string, projectId: string): Promise<IDeployment | null>;
	getAllDeployments(userId: string, query: {
		page: number,
		limit: number,
		status?: DeploymentStatus,
		search?: string,
	}): Promise<{ deployments: IDeployment[], total: number }>;

	getDeploymentById(id: string, userId: string): Promise<IDeployment | null>
	getProjectDeployments(userId: string, projectId: string, query: {
		page: number,
		limit: number,
		status?: DeploymentStatus,
		search?: string,
	}): Promise<{ deployments: IDeployment[], total: number }>;

	deleteDeployment(projectId: string, deploymentId: string, userId: string): Promise<number>;

	deployAws(project: IProject, deployment: IDeployment): Promise<void>;
	__getDeploymentById(id: string): Promise<IDeployment | null>;
	__updateDeployment(projectId: string, deploymentId: string, updateData: Partial<IDeployment>): Promise<IDeployment | null>;
}
