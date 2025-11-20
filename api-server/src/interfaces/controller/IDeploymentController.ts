import { Request, Response, NextFunction } from "express";
export interface IDeploymentController {
    createDeployment(req: Request, res: Response, next: NextFunction): Promise<void>;

    getDeployment(req: Request, res: Response, next: NextFunction): Promise<void>;
    getDeploymentsByProject(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAllDeployments(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAllDeploymentFilesData(req: Request, res: Response, next: NextFunction): Promise<void>;

    deleteDeployment(req: Request, res: Response, next: NextFunction): Promise<void>;
    __getDeployment(req: Request, res: Response, next: NextFunction): Promise<void>;
}
