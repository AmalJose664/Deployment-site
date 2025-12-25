import { Request } from "express";
import { STORAGE_FILES_ENDPOINT, STORAGE_FILES_PATH } from "../constants/paths.js";

export const proxyRewriteLocal = (path: string, req: Request) => {
	const project = req.project;
	if (!project) return undefined;
	return `${STORAGE_FILES_PATH}${project._id}/${project.currentDeployment}`
};


export const proxyRewriteCloud = (path: string, req: Request) => {
	const { project } = req
	const reWriteBaseUrl = `${STORAGE_FILES_ENDPOINT}/${project?._id}/${project?.currentDeployment}`
	console.log(reWriteBaseUrl, "-----")
	if (path === "/" || path === "") {
		return `${reWriteBaseUrl}/index.html`;
	}
	return `${reWriteBaseUrl}${path}`;
}
