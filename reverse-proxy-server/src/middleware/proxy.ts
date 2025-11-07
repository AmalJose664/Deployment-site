import { Request, } from "express";
import { createProxyMiddleware, } from "http-proxy-middleware"

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
			req.startTime = performance.now();
		},

		proxyRes: (proxyRes, req, res) => {
			res.setHeader('Access-Control-Allow-Origin', '*');
			const endTime = performance.now();
			const startTime = (req as any).startTime || endTime;
			const responseTime = (endTime - startTime).toFixed(2);
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