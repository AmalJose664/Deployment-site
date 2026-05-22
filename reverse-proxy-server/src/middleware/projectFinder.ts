import { NextFunction, Request, Response } from "express";
import { projectService } from "../service/project.service.js";
import AppError from "../utils/AppError.js";
import { breaker } from "../utils/CircuitBreaker.js";
import { fileURLToPath } from "url";
import path from "path";
import { deploymentService } from "../service/deployment.service.js";
import { ownDomain, deploymentUrlDelimeter, DEPLOYMENT_PREFIX } from "../constants/paths.js";
import { cookieOptions } from "../constants/cookieContanst.js";
import { ProjectRefined } from "../interfaces/service/IProjectService.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

declare global {
	namespace Express {
		interface Request {
			project?: ProjectRefined;
			startTime?: number;
			isManualDeploymentSelection: boolean;
			manualDeploymentId?: string
		}
	}
}
export type RequestWithProject = Request & {
	project?: ProjectRefined;
	startTime?: number
}

export async function findProjectDplIds(req: Request, res: Response, next: NextFunction) {

	// console.log(req.subdomains, " < < < < <")
	// console.log(req.hostname, " > > > > > >")



	try {
		if (breaker.isOpen) {
			next(new AppError("Service temporarily unavailable", 503));
			return;
		}

		const hostnameParts = req.hostname.split('.');
		if (hostnameParts.length < 2) {
			res.status(400).json({ error: 'Invalid hostname' });
			return;
		}

		const subdomain = hostnameParts[0];

		if (!subdomain || subdomain === ownDomain || subdomain === 'www') {
			res.status(400).json({ error: 'Invalid subdomain' });
			return;
		}

		let project = null;
		let deploymentObj = null;
		req.isManualDeploymentSelection = false;

		// 1. Check if this is a direct deployment URL


		if (subdomain.startsWith(DEPLOYMENT_PREFIX)) {
			req.isManualDeploymentSelection = true;
			const deploymentSelectId = subdomain.replace(DEPLOYMENT_PREFIX, '');

			if (!deploymentSelectId) {
				res.status(400).json({ error: 'Invalid deployment format' });
				return;
			}

			// Look up the deployment FIRST using the public ID
			deploymentObj = await deploymentService.findDeploymentByPublicId(deploymentSelectId);
			if (!deploymentObj) {
				res.status(404).json({
					error: 'Deployment not found',
					deploymentId: deploymentSelectId
				});
				return;
			}

			// Look up the project using the deployment's projectId 
			project = await projectService.findProjectById(deploymentObj.projectId);
			req.manualDeploymentId = deploymentObj._id;

		} else {
			// 2. Otherwise, treat the subdomain as the project slug
			project = await projectService.findProjectBySlug(subdomain);
		}

		// 3. Common Project Validations
		if (!project || project.isDeleted) {
			res.cookie('project_id', JSON.stringify({ _id: project?._id, frontend: process.env.FRONTEND_URL }), cookieOptions);
			res.status(404).sendFile(path.join(__dirname, "../", "views/project404.html"));
			return;
		}

		if (project.isDisabled) {
			res.cookie('project_id', JSON.stringify({ _id: project?._id, frontend: process.env.FRONTEND_URL }), cookieOptions);
			res.status(403).sendFile(path.join(__dirname, "../", "views/project-disabled.html"));
			return;
		}

		// 4. Validate live deployments only if they are accessing the main project URL
		if (!req.isManualDeploymentSelection) {
			if (!project.currentDeployment && !!project.tempDeployment) {
				res.cookie('project_id', JSON.stringify({ _id: project?._id, frontend: process.env.FRONTEND_URL }), cookieOptions);
				res.status(404).sendFile(path.join(__dirname, "../", "views/project-build.html"));
				res.set('Retry-After', '30');
				return;
			}
			if (!project.currentDeployment) {
				res.cookie('project_id', JSON.stringify({ _id: project?._id, frontend: process.env.FRONTEND_URL }), cookieOptions);
				res.status(404).sendFile(path.join(__dirname, "../", "views/no-deployment.html"));
				return;
			}
		}

		req.project = project;
		breaker.recordSuccess();
		next();

	} catch (error) {
		if (!(error instanceof AppError)) {
			breaker.recordFailure();
		}
		console.error('Project lookup error:', error);
		next(error);
	}
}
