import { Request, Response, NextFunction } from "express";

export interface IProjectController {
    createProject(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAllProjects(req: Request, res: Response, next: NextFunction): Promise<void>;

    __getProjects(req: Request, res: Response, next: NextFunction): Promise<void>;
}
