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
	pathRewrite: proxyRewriteCloud,
	on: {
		proxyReq: onProxyReq,
		proxyRes: onProxyRes,

		error: onProxyError
	}
});
