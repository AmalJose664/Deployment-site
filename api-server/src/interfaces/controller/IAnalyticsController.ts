import { Request, Response, NextFunction } from "express";
export interface IAnalyticsController {
	bandWidth(req: Request, res: Response, next: NextFunction): Promise<void>;
}