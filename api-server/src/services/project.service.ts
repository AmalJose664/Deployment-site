import { Types } from "mongoose";
import { IProjectRepository } from "../interfaces/repository/IProjectRepository.js";
import { IUserRepository } from "../interfaces/repository/IUserRepository.js";
import { IProjectService, options } from "../interfaces/service/IProjectService.js";
import { IProject, ProjectStatus } from "../models/Projects.js";
import { IUser } from "../models/User.js";
import { generateSlug } from "random-word-slugs";
import { CreateProjectDTO, QueryProjectDTO } from "../dtos/project.dto.js";
import AppError from "../utils/AppError.js";
import { HTTP_STATUS_CODE } from "../utils/statusCodes.js";
import { PLANS } from "../constants/plan.js";
import { IProjectBandwidthRepository } from "../interfaces/repository/IProjectBandwidthRepository.js";
import { IDeploymentRepository } from "../interfaces/repository/IDeploymentRepository.js";
import { DeploymentStatus } from "../models/Deployment.js";

class ProjectService implements IProjectService {
	private projectRepository: IProjectRepository;
	private deploymentRepository: IDeploymentRepository;
	private userRepository: IUserRepository;
	private projectBandwidthRepo: IProjectBandwidthRepository

	constructor(projectRepo: IProjectRepository, userRepo: IUserRepository,
		projectBandwidthRepo: IProjectBandwidthRepository, deploymentRepo: IDeploymentRepository,) {
		this.projectRepository = projectRepo;
		this.userRepository = userRepo;
		this.projectBandwidthRepo = projectBandwidthRepo
		this.deploymentRepository = deploymentRepo;
	}
	async createProject(dto: CreateProjectDTO, userId: string): Promise<IProject | null> {
		const projectData: Partial<Omit<IProject, keyof Document>> = {
			name: dto.name,
			user: new Types.ObjectId(userId),
			repoURL: dto.repoURL,
			branch: dto.branch,
			buildCommand: dto.buildCommand,
			env: dto.env || [],
			installCommand: dto.installCommand,
			outputDirectory: dto.outputDirectory,
			rootDir: dto.rootDir,
			subdomain: `${generateSlug()}-${Math.floor(Math.random() * 10000)}`,
		};

		const user = await this.userRepository.findByUserId(userId);
		if (!user) {
			throw new AppError("User not found", HTTP_STATUS_CODE.NOT_FOUND);
		}
		if (user?.projects > PLANS[user.plan].maxProjects) {
			throw new AppError("Reached maximum projects", HTTP_STATUS_CODE.SERVICE_UNAVAILABLE);
		}
		const newProject = await this.projectRepository.createProject(projectData);
		await this.projectBandwidthRepo.addProjectField(newProject as IProject)
		await this.userRepository.incrementProjects(user.id);

		return newProject;
	}

	async getAllProjects(userId: string, query: QueryProjectDTO): Promise<{ projects: IProject[]; total: number }> {
		return await this.projectRepository.getAllProjects(userId, query);
	}
	async getProjectById(id: string, userId: string, include?: string): Promise<IProject | null> {
		const user = await this.userRepository.findByUserId(userId);
		if (!user) {
			throw new AppError("User not found", 404);
		}
		const project = await this.projectRepository.findProject(id, userId, include);

		return project;
	}
	async updateProject(id: string, userId: string, dto: Partial<IProject>): Promise<IProject | null> {
		const user = await this.userRepository.findByUserId(userId);
		if (!user) {
			throw new AppError("User not found", 404);
		}
		const newData: Partial<IProject> = {
			...(dto.name && { name: dto.name }),
			...(dto.branch && { branch: dto.branch }),
			...(dto.installCommand && { installCommand: dto.installCommand }),
			...(dto.buildCommand && { buildCommand: dto.buildCommand }),
			...(dto.rootDir && { rootDir: dto.rootDir }),
			...(dto.outputDirectory && { outputDirectory: dto.outputDirectory }),
			...(dto.hasOwnProperty("isDisabled") && { isDisabled: dto.isDisabled }),
			...(dto.env?.length && { env: dto.env.map((en) => ({ name: en.name, value: en.value })) }),
		};
		console.log(newData, dto);
		if (!newData || Object.keys(newData).length === 0) {
			return null;
		}
		const project = await this.projectRepository.updateProject(id, userId, newData);
		return project;
	}

	async deleteProject(projectId: string, userId: string): Promise<boolean> {
		const user = await this.userRepository.findByUserId(userId);
		if (!user) {
			throw new AppError("User not found, Cant delete project", 404);
		}

		const result = await this.projectRepository.deleteProject(projectId, userId);
		if (!result) {
			return false;
		}
		await this.userRepository.decrementProjects(userId)
		return true;
	}

	async getProjectBandwidthData(projectId: string, userId: string, isMonthly: boolean): Promise<number> {
		if (isMonthly) {
			return await this.projectBandwidthRepo.getProjectMonthlyBandwidth(projectId, userId)
		}
		return await this.projectBandwidthRepo.getProjectTotalBandwidth(projectId, userId)

	}
	async getUserBandwidthData(userId: string, isMonthly: boolean): Promise<number> {
		if (isMonthly) {
			console.log("through here ")
			return this.projectBandwidthRepo.getUserMonthlyBandwidth(userId)
		}
		return await this.projectBandwidthRepo.getUserTotalBandwidth(userId)
	}
	async checkSubdomainAvaiable(newSubdomain: string): Promise<boolean> {
		const projects = await this.projectRepository.findProjectsBySubdomain(newSubdomain)
		if (projects.length > 0) {
			return false
		}
		return true
	}
	async changeProjectSubdomain(userId: string, projectId: string, newSubdomain: string): Promise<IProject | null> {
		const project = await this.projectRepository.findProject(projectId, userId,)
		if (!project) {
			throw new AppError("Project not found", 404)
		}
		const isAvailable = await this.checkSubdomainAvaiable(newSubdomain);
		if (!isAvailable) {
			throw new AppError("Subdomain already taken", 409);
		}
		return await this.projectRepository.updateProject(project._id, userId, { subdomain: newSubdomain })

	}
	async changeProjectDeployment(userId: string, projectId: string, newDeploymentId: string,): Promise<IProject | null> {
		const [project, deployment] = await Promise.all([
			this.projectRepository.findProject(projectId, userId),
			this.deploymentRepository.findDeploymentById(newDeploymentId, userId)
		])
		if (!project) {
			throw new AppError("Project not found", 404)
		}
		if (!deployment) {
			throw new AppError("Deployment not found", 404)
		}
		if (project.currentDeployment === deployment._id.toString()) {
			throw new AppError("Deployment is already active", 400);
		}
		if (deployment.project.toString() !== project._id.toString()) {
			throw new AppError("Deployment not related to project || unknown deployment", 403)
		}
		if (project.status === ProjectStatus.BUILDING || project.status === ProjectStatus.QUEUED) {
			throw new AppError("Cannot perform action while project is in progress", 400)
		}
		if (deployment.status !== DeploymentStatus.READY) {
			throw new AppError(
				`Cannot promote to deployment with status: ${deployment.status}. Only successful deployments can be activated.`,
				400
			);
		}

		return this.projectRepository.updateProject(project._id, userId, {
			lastDeployment: project.currentDeployment,
			currentDeployment: deployment._id.toString()
		})
	}

	async __getProjectById(id: string): Promise<IProject | null> {
		//container  or internal only
		return await this.projectRepository.__findProject(id);
	}
	async __updateProjectById(projectId: string, updateData: Partial<IProject>, options?: options): Promise<IProject | null> {
		//container   or internal only

		if (options?.updateStatusOnlyIfNoCurrentDeployment) {
			const project = await this.__getProjectById(projectId);
			if (project?.currentDeployment) {
				updateData.status = ProjectStatus.READY;
			}
		}
		return await this.projectRepository.__updateProject(projectId, updateData);
	}
}

export default ProjectService;
