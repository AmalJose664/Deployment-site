import { Request, Response, NextFunction } from "express";
export interface IDeploymentController {
	createDeployment(req: Request, res: Response, next: NextFunction): Promise<void>;
	getAllDeployments(req: Request, res: Response, next: NextFunction): Promise<void>;
	getProjectDeployments(req: Request, res: Response, next: NextFunction): Promise<void>;
	deleteDeployment(req: Request, res: Response, next: NextFunction): Promise<void>;
	__getDeployment(req: Request, res: Response, next: NextFunction): Promise<void>;
}
