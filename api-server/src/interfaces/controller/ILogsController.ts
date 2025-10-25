import { Request, Response, NextFunction } from "express";
export interface ILogsController {
	getLogsByDeployment(req: Request, res: Response, next: NextFunction): Promise<void>;
	getLogsByProject(req: Request, res: Response, next: NextFunction): Promise<void>
}
