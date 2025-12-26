import { isbot } from "isbot";
import { ClientRequest } from "http";
import { Request } from "express";
import { STORAGE_BASE_URL } from "../../constants/paths.js";
export const onProxyReq = (
	proxyReq: ClientRequest,
	req: Request
) => {
	proxyReq.setHeader("Host", (STORAGE_BASE_URL || "").split("://")[1])
	proxyReq.setHeader("X-Forwarded-Host", req.headers.host || "");

	(req as any).isBot = isbot(req.headers["user-agent"] || "");
	(req as any).startTime = performance.now();
};