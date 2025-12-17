import { RequestWithProject } from "../../middleware/projectChecker.js";

export const onProxyError = (err: any, req: RequestWithProject) => {
	console.error("Proxy error:", {
		error: err.message,
		projectId: req.project?._id,
		path: req.url,
	});
};