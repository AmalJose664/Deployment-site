import { Request, Response, NextFunction } from "express";
import { IDeploymentController } from "../interfaces/controller/IDeploymentController.js";
import { IDeploymentService } from "../interfaces/service/IDeploymentService.js";
class DeploymentController implements IDeploymentController {
    private deploymentService: IDeploymentService;
    constructor(deployService: IDeploymentService) {
        this.deploymentService = deployService;
    }

    async createDeployment(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userId = req.user?.id as string;
        const projectId = req.body.projectId;
        try {
            const deployment = await this.deploymentService.newDeployment({}, userId, projectId);
            console.log(deployment);
            res.json({ time: performance.now() });
        } catch (error) {
            next(error);
        }
    }

    async getProjectDeployments(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id as string;
            const result = await this.deploymentService.getProjectDeployments(userId, "");
            res.json({ hai: Math.random(), result });
        } catch (error) {
            next(error);
        }
    }

    async getAllDeployments(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id as string;
            const result = await this.deploymentService.getAllDeployments(userId);
            res.json({ result });
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

    async __getDeployments(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const deploymenttId = req.params.id;
            const deployment = await this.deploymentService.__getDeploymentById(deploymenttId);

            res.json({ deployment });
        } catch (error) {
            next(error);
        }
    }
}

export default DeploymentController;
