import { Request, Response, NextFunction } from "express";

export interface IProjectController {
	createProject(req: Request, res: Response, next: NextFunction): Promise<void>;
	getAllProjects(req: Request, res: Response, next: NextFunction): Promise<void>;
	getProject(req: Request, res: Response, next: NextFunction): Promise<void>;
	updateProject(req: Request, res: Response, next: NextFunction): Promise<void>;
	changeCurrentDeployment(req: Request, res: Response, next: NextFunction): Promise<void>;
	updateSubdomain(req: Request, res: Response, next: NextFunction): Promise<void>;
	deleteProject(req: Request, res: Response, next: NextFunction): Promise<void>;
	checkSubdomainAvailable(req: Request, res: Response, next: NextFunction): Promise<void>;
	getProjectSimpleStats(req: Request, res: Response, next: NextFunction): Promise<void>;

	__getProjects(req: Request, res: Response, next: NextFunction): Promise<void>;
}
