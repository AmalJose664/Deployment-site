import { Types } from "mongoose";
import { IDeploymentRepository } from "../interfaces/repository/IDeploymentRepository.js";
import { IProjectRepository } from "../interfaces/repository/IProjectRepository.js";
import { IDeploymentService } from "../interfaces/service/IDeploymentService.js";
import { IDeployment } from "../models/Deployment.js";
import AppError from "../utils/AppError.js";
import { IProject, ProjectStatus } from "../models/Projects.js";
import { RunTaskCommand } from "@aws-sdk/client-ecs";
import { config, ecsClient } from "../config/awsClient.js";

class DeploymentService implements IDeploymentService {
    private deploymentRepository: IDeploymentRepository;
    private projectRepository: IProjectRepository;
    constructor(deploymentRepo: IDeploymentRepository, projectRepo: IProjectRepository) {
        this.deploymentRepository = deploymentRepo;
        this.projectRepository = projectRepo;
    }
    async newDeployment(deploymentData: Partial<IDeployment>, userId: string, projectId: string): Promise<IDeployment | null> {
        const correspondindProject = await this.projectRepository.findProject(projectId, userId);
        if (!correspondindProject) {
            throw new AppError("Project not found", 404);
        }
        if (correspondindProject.status === ProjectStatus.BUILDING) {
            throw new AppError("Project deployment already in progress", 400);
        }

        deploymentData.overWrite = false;
        deploymentData.commit_hash = "000000";
        deploymentData.s3Path = correspondindProject._id.toString();
        deploymentData.project = new Types.ObjectId(correspondindProject._id);
        deploymentData.userId = correspondindProject.user;

        const deployment = await this.deploymentRepository.createD(deploymentData);
        return deployment;
    }

    async deleteDeployment(projectId: string, deploymentId: string, userId: string): Promise<number> {
        const result = await this.deploymentRepository.deleteD(projectId, deploymentId, userId);
        return result;
    }

    async getAllDeployments(userId: string): Promise<IDeployment[]> {
        return await this.deploymentRepository.findAllD(userId);
    }

    async getProjectDeployments(userId: string, projectId: string): Promise<IDeployment[]> {
        return await this.deploymentRepository.findProjectD(userId, projectId);
    }

    async updateDeployment(projectId: string, deploymentId: string, userId: string, updateData: Partial<IDeployment>): Promise<IDeployment | null> {
        const correspondindProject = await this.projectRepository.findProject(projectId, userId);

        if (!correspondindProject) {
            throw new AppError("Specified project not found", 404);
        }
        return await this.deploymentRepository.updateD(projectId, userId, deploymentId, updateData);
    }

    async __getDeploymentById(id: string): Promise<IDeployment | null> {
        //container
        return this.deploymentRepository.findD(id);
    }

    async deployAws(project: IProject, deployment: IDeployment) {
        const command = new RunTaskCommand({
            cluster: config.CLUSTER,
            taskDefinition: config.TASK,
            launchType: "FARGATE",
            count: 1,
            networkConfiguration: {
                awsvpcConfiguration: {
                    subnets: process.env.SUBNETS_STRING?.split(","),
                    securityGroups: process.env.SECURITY_GROUPS?.split(","),
                    assignPublicIp: "ENABLED",
                },
            },
            overrides: {
                containerOverrides: [
                    {
                        name: "custom-build-container", // docker image after build,
                        environment: [
                            ...project.env,
                            { name: "SERVER_PUSHED_D_ID", value: deployment._id },
                            { name: "SERVER_PUSHED_P_ID", value: project.id },
                        ],
                    },
                ],
            },
        });
        await ecsClient.send(command);
    }
}

export default DeploymentService;
