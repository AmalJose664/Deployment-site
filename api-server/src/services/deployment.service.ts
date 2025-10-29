import { Types } from "mongoose";
import { IDeploymentRepository } from "../interfaces/repository/IDeploymentRepository.js";
import { IProjectRepository } from "../interfaces/repository/IProjectRepository.js";
import { IDeploymentService } from "../interfaces/service/IDeploymentService.js";
import { DeploymentStatus, IDeployment } from "../models/Deployment.js";
import AppError from "../utils/AppError.js";
import { IProject, ProjectStatus } from "../models/Projects.js";
import { RunTaskCommand } from "@aws-sdk/client-ecs";
import { config, ecsClient } from "../config/awsClient.js";

import { exec } from "child_process"
import { QueryDeploymentDTO } from "../dtos/deployment.dto.js";

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
		if (correspondindProject.isDeleted) {
			throw new AppError("Project not available for deployment", 400);
		}

		deploymentData.status = DeploymentStatus.QUEUED
		deploymentData.overWrite = false;
		deploymentData.commit_hash = "------";
		deploymentData.s3Path = correspondindProject._id.toString();
		deploymentData.project = new Types.ObjectId(correspondindProject._id);
		deploymentData.userId = correspondindProject.user;

		const deployment = await this.deploymentRepository.createDeployment(deploymentData);
		await this.projectRepository.pushToDeployments(correspondindProject.id, userId, deployment?.id)
		if (deployment?._id) {
			// this.deployLocal(deployment?._id, projectId)
		}
		return deployment;
	}


	async getDeploymentById(id: string, userId: string): Promise<IDeployment | null> {
		return await this.deploymentRepository.findDeploymentById(id, userId);
	}

	async getAllDeployments(userId: string, query: QueryDeploymentDTO): Promise<{ deployments: IDeployment[], total: number }> {
		return await this.deploymentRepository.findAllDeployments(userId, query);
	}

	async getProjectDeployments(userId: string, projectId: string, query: QueryDeploymentDTO): Promise<{ deployments: IDeployment[], total: number }> {
		const correspondindProject = await this.projectRepository.findProject(projectId, userId);
		if (!correspondindProject) {
			throw new AppError("Project not found", 404);
		}
		return await this.deploymentRepository.findProjectDeployments(userId, projectId, query);
	}


	async deleteDeployment(projectId: string, deploymentId: string, userId: string): Promise<number> {
		const result = await this.deploymentRepository.deleteDeployment(projectId, deploymentId, userId);
		await this.projectRepository.pullDeployments(projectId, userId, deploymentId)
		return result;
	}

	async __getDeploymentById(id: string): Promise<IDeployment | null> {
		//container
		return this.deploymentRepository.__findDeployment(id);
	}
	async __updateDeployment(projectId: string, deploymentId: string, updateData: Partial<IDeployment>): Promise<IDeployment | null> {
		const result = await this.deploymentRepository.__updateDeployment(projectId, deploymentId, updateData)
		return result
	}
	async deployLocal(deploymentId: string, projectId: string) {
		const command = exec(
			"node script.js",
			{
				cwd: "../build-server/",
				env: {
					...process.env,
					DEPLOYMENT_ID: deploymentId,
					PROJECT_ID: projectId
				}
			}
		);

		command.stdout?.on("data", (data) => {
			console.log(`[stdout]: ${data.toString().trim()}`);
		});

		command.stderr?.on("data", (data) => {
			console.error(`[stderr]: ${data.toString().trim()}`);
		});

		command.on("exit", (code) => {
			console.log(`Process exited with code ${code}`);
		});

		command.on("error", (err) => {
			console.error("Failed to start process:", err);
		});
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
