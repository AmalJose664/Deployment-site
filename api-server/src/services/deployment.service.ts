import { Types } from "mongoose";
import { IDeploymentRepository } from "../interfaces/repository/IDeploymentRepository.js";
import { IProjectRepository } from "../interfaces/repository/IProjectRepository.js";
import { IDeploymentService } from "../interfaces/service/IDeploymentService.js";
import { DeploymentStatus, IDeployment } from "../models/Deployment.js";
import AppError from "../utils/AppError.js";
import { IProject, ProjectStatus } from "../models/Projects.js";
import { RunTaskCommand } from "@aws-sdk/client-ecs";
import { config, ecsClient, s3Client } from "../config/awsClient.js";
import { rm } from "fs/promises";

import { spawn } from "child_process";
import { QueryDeploymentDTO } from "../dtos/deployment.dto.js";
import { BUILD_SERVER_PATH, BUILD_SERVER_RUN_SCRIPT, LOCAL_TEST_SERVER_USER_FILES, S3_OUTPUTS_DIR } from "../constants/paths.js";
import { _Object, DeleteObjectCommand, DeleteObjectsCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import getNessesaryEnvs from "../utils/getNessesaryEnvs.js";
import { IUserSerivce } from "../interfaces/service/IUserService.js";
import { redisClient } from "../config/redis.js";

class DeploymentService implements IDeploymentService {
	private deploymentRepository: IDeploymentRepository;
	private projectRepository: IProjectRepository;
	private userService: IUserSerivce;
	constructor(deploymentRepo: IDeploymentRepository, projectRepo: IProjectRepository, userService: IUserSerivce) {
		this.deploymentRepository = deploymentRepo;
		this.projectRepository = projectRepo;
		this.userService = userService

	}
	async newDeployment(deploymentData: Partial<IDeployment>, userId: string, projectId: string): Promise<IDeployment | null> {

		const canDeploy = await this.userService.userCanDeploy(userId);
		if (!canDeploy.allowed) {
			throw new AppError("Daily deployment limit exceeded", 400);
		}

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

		deploymentData.status = DeploymentStatus.QUEUED;
		deploymentData.overWrite = false;
		deploymentData.commit_hash = "------||------";
		deploymentData.s3Path = correspondindProject._id.toString();
		deploymentData.project = new Types.ObjectId(correspondindProject._id);
		deploymentData.user = correspondindProject.user;

		const deployment = await this.deploymentRepository.createDeployment(deploymentData);

		await Promise.all(
			[
				this.projectRepository.pushToDeployments(correspondindProject.id, userId, deployment?.id),
				this.userService.incrementDeployment(correspondindProject.user.toString())
			]
		)
		if (deployment?._id) {
			this.deployLocal(deployment?._id, projectId)
		}
		return deployment;
	}

	async getDeploymentById(id: string, userId: string, includesField?: string): Promise<IDeployment | null> {
		return await this.deploymentRepository.findDeploymentById(id, userId, includesField);
	}

	async getAllDeployments(userId: string, query: QueryDeploymentDTO): Promise<{ deployments: IDeployment[]; total: number }> {
		return await this.deploymentRepository.findAllDeployments(userId, query);
	}

	async getProjectDeployments(
		userId: string,
		projectId: string,
		query: QueryDeploymentDTO,
	): Promise<{ deployments: IDeployment[]; total: number }> {
		const correspondindProject = await this.projectRepository.findProject(projectId, userId);
		if (!correspondindProject) {
			throw new AppError("Project not found", 404);
		}
		return await this.deploymentRepository.findProjectDeployments(userId, projectId, query);
	}

	async deleteDeployment(projectId: string, deploymentId: string, userId: string): Promise<number> {
		const project = await this.projectRepository.findProject(projectId, userId);
		if (!project) throw new AppError("Project not found", 404);

		if (project.status === ProjectStatus.BUILDING || project.status === ProjectStatus.QUEUED) {
			throw new AppError("Project is currently in progress state, please try later", 400);
		}

		if (!project.deployments?.includes(deploymentId as any)) {
			throw new AppError("Deployment not found", 404);
		}
		let newCurrentDeployment = null;

		if (project.currentDeployment === deploymentId) {
			const allDeployments = await this.deploymentRepository.__findAllProjectDeployment(projectId, "createdAt");
			const currentIndex = allDeployments.findIndex((d) => d._id.toString() === deploymentId);
			console.log(allDeployments, "<<<<", currentIndex);

			if (currentIndex > 0) {
				newCurrentDeployment = allDeployments[currentIndex - 1]._id;
			}
		}

		await this.deleteLocal(deploymentId, project._id);
		await this.projectRepository.pullDeployments(
			projectId,
			userId,
			deploymentId,
			newCurrentDeployment ? newCurrentDeployment : deploymentId === project.currentDeployment ? null : project.currentDeployment,
		);
		return await this.deploymentRepository.deleteDeployment(projectId, deploymentId, userId);
	}

	async __getDeploymentById(id: string): Promise<IDeployment | null> {
		//container
		return this.deploymentRepository.__findDeployment(id);
	}

	async __updateDeployment(projectId: string, deploymentId: string, updateData: Partial<IDeployment>): Promise<IDeployment | null> {
		const result = await this.deploymentRepository.__updateDeployment(projectId, deploymentId, updateData);
		return result;
	}

	async deployLocal(deploymentId: string, projectId: string): Promise<void> {
		try {
			const envs = getNessesaryEnvs()

			const message = {
				deploymentId,
				projectId,
				envs
			}
			await redisClient.publish("deployment", JSON.stringify(message))
			return
			const command = spawn("node", [BUILD_SERVER_RUN_SCRIPT], {
				cwd: BUILD_SERVER_PATH,
				env: {
					...process.env,
					DEPLOYMENT_ID: deploymentId,
					PROJECT_ID: projectId,
				},
			});

			command.stdout?.on("data", (data) => {
				console.log(`[stdout]: -----data-----from----deployLocal`,);
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

		} catch (error: any) {
			await this.__updateDeployment(projectId, deploymentId,
				{ status: DeploymentStatus.FAILED, error_message: error.message }
			)
		}
	}
	async deployAws(project: IProject, deployment: IDeployment): Promise<void> {
		try {
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
								...getNessesaryEnvs(),
								{ name: "SERVER_PUSHED_D_ID", value: deployment._id },
								{ name: "SERVER_PUSHED_P_ID", value: project.id },
							],
						},
					],
				},
			});
			await ecsClient.send(command);
		} catch (error: any) {
			await this.__updateDeployment(project._id, deployment._id,
				{ status: DeploymentStatus.FAILED, error_message: error.message }
			)
		}
	}

	async deleteLocal(deploymentId: string, projectId: string): Promise<void> {
		const path = `${LOCAL_TEST_SERVER_USER_FILES}/${projectId}/${deploymentId}/`;
		console.log("deleting files at ", path);

		await rm(path, {
			recursive: true,
			force: true,
		});
	}

	async deleteAws(deploymentId: string, projectId: string): Promise<void> {
		const prefix = `${S3_OUTPUTS_DIR}/${projectId}/${deploymentId}/`;
		const APP_FILES_BUCKET = process.env.AWS_S3_BUCKET;
		const listCommand = new ListObjectsV2Command({
			Bucket: APP_FILES_BUCKET,
			Prefix: prefix,
		});
		const listed = await s3Client.send(listCommand);
		if (!listed.Contents || listed.Contents.length === 0) {
			return;
		}
		const deleteCommand = new DeleteObjectsCommand({
			Bucket: APP_FILES_BUCKET,
			Delete: {
				Objects: listed.Contents.map((obj: _Object) => ({ Key: obj.Key })),
			},
		});
		await s3Client.send(deleteCommand);
	}
}

export default DeploymentService;
