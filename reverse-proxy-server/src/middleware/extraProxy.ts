import { Request } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { STORAGE_SERVER_URL } from "../contants/paths.js";


export const extraProxy = createProxyMiddleware({
	target: STORAGE_SERVER_URL,
	changeOrigin: true,
	pathRewrite: (path, req: Request) => {
		const projectId = req.params.projectId
		const deploymentId = req.params.deploymentId

		const queryString = path.split('?')[1] || ''
		const queryPath = queryString ? `?${queryString}` : ''

		return `/downloads/${projectId}/${deploymentId}/${queryPath}`
	},
	on: {
		error: (err, req, res) => {
			console.error('Proxy error:', {
				error: err.message,
				path: req.url,
			}, err);

		}
	}
});