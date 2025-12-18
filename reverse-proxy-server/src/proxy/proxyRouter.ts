import { Request } from "express";
import { getTargetUrl } from "../config/proxy.config.js";

export const proxyRouter = (req: Request) => {
	const project = req.project;
	if (!project) return undefined;

	return getTargetUrl(
		project._id,
		project.currentDeployment || ""
	);
};
