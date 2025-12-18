import { NextFunction, Request, Response } from "express";
import { IProject } from "../models/Project.js";
import { projectService } from "../service/project.service.js";
import AppError from "../utils/AppError.js";
import { breaker } from "../utils/CircuitBreaker.js";

declare global {
	namespace Express {
		interface Request {
			project?: IProject;
			startTime?: number
		}
	}
}
export type RequestWithProject = Request & {
	project?: IProject;
	startTime?: number
}

export async function checkProject(req: Request, res: Response, next: NextFunction) {
	const ownDomain = process.env.OWN_DOMAIN
	try {
		if (breaker.isOpen) {
			next(new AppError("Service temporarily unavailable", 503));
			return
		}
		const slug = req.hostname.split('.')[0];
		if (!slug || slug === ownDomain || slug === 'www') {
			console.log(slug)
			res.status(400).json({ error: 'Invalid subdomain' });
			return;
		}

		const project = await projectService.findProjectBySlug(slug);
		if (!project || project.isDeleted) {
			res.status(404).json({
				error: 'Project not found',
				slug
			});
			return
		}
		if (project.isDisabled) {
			res.status(404).json({
				error: 'Project not accesible, Project disabled',
				slug
			});
			return
		}
		if (!project.currentDeployment) {
			res.status(404).json({
				error: 'Project Deployment not found',
				slug
			});
			return
		}
		if (!project.currentDeployment && !!project.tempDeployment) {
			res.status(404).json({
				error: 'Project is building please wait',
				slug
			});
			return
		}

		req.project = project;
		breaker.recordSuccess()
		next();

	} catch (error) {
		if (!(error instanceof AppError)) {
			breaker.recordFailure();
		}
		console.error('Project lookup error:', error);
		next(error);
	}
}
