import { Request, } from "express";
import { createProxyMiddleware, } from "http-proxy-middleware"
import { isbot } from 'isbot';
import { IAnalytics } from "../models/Analytics.js";
import { analyticsService } from "../service/analytics.service.js";
import parseUA from "../utils/uaParser.js";
import { STORAGE_SERVER_FILES } from "../contants/paths.js";



export const proxy = createProxyMiddleware({
	changeOrigin: true,
	router: (req: Request) => {
		console.log("real proxy endpoint <<<<<<<<<<<<<<<-------\n\n")
		const project = req.project;
		if (!project) return undefined
		return `${STORAGE_SERVER_FILES}${project._id}/${project.currentDeployment}`;
	},

	on: {
		proxyReq: (proxyReq, req, res) => {

			proxyReq.setHeader('Host', req.project?.subdomain || "");
			proxyReq.setHeader('X-Forwarded-Host', req.headers.host || '');

			(req as any).isBot = isbot(req.headers['user-agent'] || '');
			req.startTime = performance.now();
		},

		proxyRes: (proxyRes, req, res) => {
			res.setHeader('Access-Control-Allow-Origin', '*');
			const requestSize = parseInt(req.headers['content-length'] || '0', 10);
			const size = proxyRes.headers["x-file-size"] as string

			const responseSize = parseInt(size || proxyRes.headers['content-length'] || '0', 10);


			const endTime = performance.now();
			const startTime = (req as any).startTime || endTime;
			const responseTime = (endTime - startTime).toFixed(2);
			const ua = parseUA(req.headers['user-agent'] || "")
			const data: IAnalytics = {
				projectId: req.project?._id || "",
				subdomain: req.project?.subdomain || "",
				timestamp: new Date().getTime(),
				path: req.url,
				requestSize,
				responseSize,
				responseTime: parseFloat(responseTime),
				ip: req.socket.remoteAddress || "",
				statusCode: res.statusCode || proxyRes.statusCode || 0,
				uaBrowser: ua.browser,
				uaOs: ua.os,
				isMobile: ua.isMobile,
				isBot: (req as any).isBot,
				referer: req.headers['referer'] || ""
			}
			analyticsService.sendAnalytics(data)

		},

		error: (err, req, res) => {
			console.error('Proxy error:', {
				error: err.message,
				projectId: req.project?._id, ///// HERE
				path: req.url,
			}, err);

		}
	}
});