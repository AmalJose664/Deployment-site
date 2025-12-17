import { isbot } from "isbot";
import { ClientRequest } from "http";
import { Request } from "express";
export const onProxyReq = (
	proxyReq: ClientRequest,
	req: Request
) => {
	proxyReq.setHeader("Host", req.project?.subdomain || "");
	proxyReq.setHeader("X-Forwarded-Host", req.headers.host || "");

	(req as any).isBot = isbot(req.headers["user-agent"] || "");
	(req as any).startTime = performance.now();
};