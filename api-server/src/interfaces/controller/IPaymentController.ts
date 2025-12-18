import { Request, Response, NextFunction } from "express";

export interface IPaymentController {
	checkout(req: Request, res: Response, next: NextFunction): Promise<void>;
	webhook(req: Request, res: Response, next: NextFunction): Promise<void>;
}
