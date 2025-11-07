import { NextFunction, Request, Response } from "express";
import { IProject } from "../models/Project.js";
import { projectService } from "../service/project.service.js";

declare global {
	namespace Express {
		interface Request {
			project?: IProject;
			startTime?: number
		}
	}
}


export async function checkProject(req: Request, res: Response, next: NextFunction) {
	try {
		const slug = req.hostname.split('.')[0];
		if (!slug || slug === 'localhost' || slug === 'www') {
			res.status(400).json({ error: 'Invalid subdomain' });
			return;
		}

		const project = await projectService.findProjectBySlug(slug);

		if (!project) {
			res.status(404).json({
				error: 'Project not found',
				slug
			});
			return
		}

		req.project = project;
		next();

	} catch (error) {
		console.error('Project lookup error:', error);
		next(error);
	}
}
