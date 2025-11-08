import { Request, } from "express";
import { createProxyMiddleware, } from "http-proxy-middleware"

import { isbot } from 'isbot';
import { IAnalytics } from "../models/Analytics.js";
import { analyticsService } from "../service/analytics.service.js";

const BUCKET_NAME = "new-vercel-664" //                             FILL HERE
const BASE_PATH = `https://${BUCKET_NAME}.s3.us-east-1.amazonaws.com/__outputs`

const BASE_PATH_LOCAL = `http://localhost:4000/projects/`


export const proxy = createProxyMiddleware({
	changeOrigin: true,
	router: (req: Request) => {
		const project = req.project;
		if (!project) return undefined
		return `${BASE_PATH_LOCAL}${project._id}/`;
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

			const data: IAnalytics = {
				projectId: req.project?.id || "",
				subdomain: req.project?.subdomain || "",
				timestamp: new Date().toISOString(),
				path: req.url,
				requestSize,
				responseSize,
				responseTime: parseFloat(responseTime),
				ip: req.socket.remoteAddress || "",
				statusCode: res.statusCode || proxyRes.statusCode || 0,
				ua: req.headers['user-agent'] || "",
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