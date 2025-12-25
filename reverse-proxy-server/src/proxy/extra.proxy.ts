import { createProxyMiddleware, } from "http-proxy-middleware"

import { proxyTimeouts } from "../config/proxy.config.js";
import { Request } from "express";
import { STORAGE_BASE_URL } from "../constants/paths.js";


export const extraProxy = createProxyMiddleware({
	target: STORAGE_BASE_URL,
	changeOrigin: true,
	pathRewrite: (path, req: Request) => {
		const projectId = req.params.projectId
		const deploymentId = req.params.deploymentId

		const queryString = path.split('?')[1] || ''
		const queryPath = queryString ? `?${queryString}` : ''

		return `/downloads/${projectId}/${deploymentId}/${queryPath}`
	},
	...proxyTimeouts,
	on: {
		error: (err, req, res) => {
			console.error('Proxy error:', {
				error: err.message,
				path: req.url,
			}, err);

		}
	}
});