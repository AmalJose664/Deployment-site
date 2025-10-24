import { Request, Response, NextFunction } from "express";
import { IDeploymentController } from "../interfaces/controller/IDeploymentController.js";
import { IDeploymentService } from "../interfaces/service/IDeploymentService.js";
import { DeploymentMapper } from "../mappers/DeploymentMapper.js";
import { HTTP_STATUS_CODE } from "../utils/statusCodes.js";
import { CreateDeploymentDTO, QueryDeploymentDTO } from "../dtos/deployment.dto.js";
class DeploymentController implements IDeploymentController {
	private deploymentService: IDeploymentService;
	constructor(deployService: IDeploymentService) {
		this.deploymentService = deployService;
	}

	async createDeployment(req: Request, res: Response, next: NextFunction): Promise<void> {
		const userId = req.user?.id as string;
		const projectId = (req.validatedBody as CreateDeploymentDTO).projectId;
		try {
			const deployment = await this.deploymentService.newDeployment({}, userId, projectId);
			if (deployment) {
				const response = DeploymentMapper.toDeploymentResponse(deployment)
				res.status(HTTP_STATUS_CODE.CREATED).json(response);
				return
			}
			res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ deployment: null });
		} catch (error) {
			next(error);
		}
	}


	async getDeployment(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user?.id as string;
			const id = req.params.id

			const result = await this.deploymentService.getDeploymentById(id, userId)
			if (result) {
				const response = DeploymentMapper.toDeploymentResponse(result)
				res.status(HTTP_STATUS_CODE.OK).json(response);
				return
			}
			res.status(HTTP_STATUS_CODE.NOT_FOUND).json({ deployment: null });

		} catch (error) {
			next(error);
		}
	}

	async getProjectDeployments(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user?.id as string;
			const query = req.validatedQuery as QueryDeploymentDTO
			const projectId = req.params.id

			const result = await this.deploymentService.getProjectDeployments(userId, projectId);
			const response = DeploymentMapper.toDeploymentsResponse(result, result.length, query.page, query.limit)
			res.status(HTTP_STATUS_CODE.OK).json(response);
		} catch (error) {
			next(error);
		}
	}

	async getAllDeployments(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user?.id as string;
			const query = req.validatedQuery as QueryDeploymentDTO

			const result = await this.deploymentService.getAllDeployments(userId, {
				page: query.page, limit: query.limit,
				status: query.status, search: query.search
			});
			const response = DeploymentMapper.toDeploymentsResponse(result, result.length, query.page, query.limit)
			res.status(HTTP_STATUS_CODE.OK).json(response);
		} catch (error) {
			next(error);
		}
	}

	async deleteDeployment(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
		} catch (error) {
			next(error);
		}
	}

	async __getDeployment(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const deploymentId = req.params.id;
			const deployment = await this.deploymentService.__getDeploymentById(deploymentId);
			if (deployment) {
				const response = DeploymentMapper.toDeploymentResponse(deployment)
				res.status(HTTP_STATUS_CODE.CREATED).json(response);
				return
			}
			res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ deployment: null });
		} catch (error) {
			next(error);
		}
	}
}

export default DeploymentController;
