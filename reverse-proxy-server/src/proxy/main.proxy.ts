import { createProxyMiddleware, } from "http-proxy-middleware"
import { STORAGE_SERVER_FILES, STORAGE_SERVER_URL } from "../constants/paths.js";
import { httpAgent, httpsAgent, proxyTimeouts } from "../config/proxy.config.js";
import { proxyRouter } from "./router.js";

import { onProxyReq } from "./handlers/onProxyReq.js";
import { onProxyRes } from "./handlers/onProxyRes.js";
import { onProxyError } from "./handlers/onProxyError.js";
import { Request } from "express";


export const proxy = createProxyMiddleware({
	changeOrigin: true,
	agent: () => {
		return STORAGE_SERVER_FILES.startsWith('https://') ? httpsAgent : httpAgent;
	},
	router: proxyRouter,
	...proxyTimeouts,

	on: {
		proxyReq: onProxyReq,
		proxyRes: onProxyRes,

		error: onProxyError
	}
});
