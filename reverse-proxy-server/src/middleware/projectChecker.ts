import { NextFunction, Request, Response } from "express";
import { IProject } from "../models/Project.js";
import { projectService } from "../service/project.service.js";
import AppError from "../utils/AppError.js";
import { breaker } from "../utils/CircuitBreaker.js";
import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
	// console.log(req.subdomains, " < < < < <")
	// console.log(req.hostname, " < < < < <")



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
			// res.status(404).json({
			// 	error: 'Project not found',
			// 	slug
			// });
			res.cookie('project_id', JSON.stringify({ _id: project?._id + "hey", frontend: process.env.FRONTEND_URL })), {
				httpOnly: false,
				maxAge: 3600000
			};

			res.status(404).sendFile(path.join(__dirname, "../", "views/project404.html"));

			return
		}
		if (project.isDisabled) {
			// res.status(404).json({
			// 	error: 'Project not accesible, Project disabled',
			// 	slug
			// });

			res.cookie('project_id', JSON.stringify({ _id: project?._id + "hey", frontend: process.env.FRONTEND_URL })), {
				httpOnly: false,
				maxAge: 3600000
			};
			res.status(403).sendFile(path.join(__dirname, "../", "views/project-disabled.html"));
			return
		}
		if (!project.currentDeployment && !!project.tempDeployment) {
			// res.status(404).json({
			// 	error: 'Project is building please wait',
			// 	slug
			// });
			res.cookie('project_id', JSON.stringify({ _id: project?._id + "hey", frontend: process.env.FRONTEND_URL })), {
				httpOnly: false,
				maxAge: 3600000
			};
			res.status(404).sendFile(path.join(__dirname, "../", "views/project-build.html"));
			res.set('Retry-After', '30');
			return
		}
		if (!project.currentDeployment) {
			// res.status(404).json({
			// 	error: 'Project Deployment not found',
			// 	slug
			// });
			res.cookie('project_id', JSON.stringify({ _id: project?._id + "hey", frontend: process.env.FRONTEND_URL })), {
				httpOnly: false,
				maxAge: 3600000
			};
			res.status(404).sendFile(path.join(__dirname, "../", "views/no-deployment.html"));
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
