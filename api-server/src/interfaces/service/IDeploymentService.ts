import { IDeployment } from "../../models/Deployment.js";
import { IProject } from "../../models/Projects.js";

export interface IDeploymentService {
    newDeployment(deploymentData: Partial<IDeployment>, userId: string, projectId: string): Promise<IDeployment | null>;
    getAllDeployments(userId: string): Promise<IDeployment[]>;
    getProjectDeployments(userId: string, projectId: string): Promise<IDeployment[]>;
    updateDeployment(projectId: string, deploymentId: string, userId: string, updateData: Partial<IDeployment>): Promise<IDeployment | null>;

    deleteDeployment(projectId: string, deploymentId: string, userId: string): Promise<number>;

    deployAws(project: IProject, deployment: IDeployment): Promise<void>;
    __getDeploymentById(id: string): Promise<IDeployment | null>;
}
