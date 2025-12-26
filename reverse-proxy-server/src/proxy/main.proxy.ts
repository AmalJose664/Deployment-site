import { createProxyMiddleware, } from "http-proxy-middleware"
import { STORAGE_BASE_URL, STORAGE_FILES_ENDPOINT, STORAGE_MODE } from "../constants/paths.js";
import { httpAgent, httpsAgent, proxyTimeouts } from "../config/proxy.config.js";


import { onProxyReq } from "./handlers/onProxyReq.js";
import { onProxyRes } from "./handlers/onProxyRes.js";
import { onProxyError } from "./handlers/onProxyError.js";
import { proxyRewriteCloud, proxyRewriteLocal } from "./proxyRewrite.js";
import { Request } from "express";



export const proxy = createProxyMiddleware({
	changeOrigin: true,
	agent: (STORAGE_BASE_URL || "").startsWith('https://') ? httpsAgent : httpAgent,
	...proxyTimeouts,
	target: STORAGE_BASE_URL,
	pathRewrite: (path: string, req: Request) => {
		const { project } = req
		const reWriteBaseUrl = `${STORAGE_FILES_ENDPOINT}/${project?._id}/${project?.currentDeployment}`
		console.log(`${reWriteBaseUrl}/index.html`, "-----")
		if (path === "/" || path === "") {
			return `${reWriteBaseUrl}/index.html`;
		}
		return `${reWriteBaseUrl}${path}`
	},
	on: {
		proxyReq: onProxyReq,
		proxyRes: onProxyRes,

		error: onProxyError
	}
});
