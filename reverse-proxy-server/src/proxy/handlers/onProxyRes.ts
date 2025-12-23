import { redisService } from "../../cache/redis.js";
import { exemptedPaths } from "../../constants/exemptedPaths.js";
import { RequestWithProject } from "../../middleware/projectChecker.js";
import { IAnalytics } from "../../models/Analytics.js";
import { analyticsService } from "../../service/analytics.service.js";
import parseUA from "../../utils/uaParser.js";
import { IncomingMessage, ServerResponse } from "http";


export const onProxyRes = async (proxyRes: IncomingMessage, req: RequestWithProject, res: ServerResponse) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	const requestSize = parseInt(req.headers['content-length'] || '0', 10);
	const size = proxyRes.headers["x-file-size"] as string

	const responseSize = parseInt(size || proxyRes.headers['content-length'] || '0', 10);

	if (exemptedPaths[req.url]) {
		return
	}
	const endTime = performance.now();
	const startTime = (req as any).startTime || endTime;
	const responseTime = (endTime - startTime).toFixed(2);
	const ua = parseUA(req.headers['user-agent'] || "")
	const toCache = {
		projectId: req.project?._id,
		responseSize,
		responseTime,
	}
	await redisService.set(req.project?.subdomain + req.path as string, toCache, 1200)
	const data: IAnalytics = {
		projectId: req.project?._id || "",
		subdomain: req.project?.subdomain || "",
		timestamp: new Date().getTime(),
		path: req.url,
		requestSize,
		responseSize,
		responseTime: parseFloat(responseTime),
		ip: req.socket.remoteAddress || "0.0.0.0",
		statusCode: res.statusCode || proxyRes.statusCode || 0,
		uaBrowser: ua.browser,
		uaOs: ua.os,
		isMobile: ua.isMobile,
		isBot: (req as any).isBot,
		referer: req.headers['referer'] || ""
	}
	// console.log(data, "--- --`Levele data")
	analyticsService.sendAnalytics(data)

}