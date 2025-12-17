import { RequestWithProject } from "../../middleware/projectChecker.js";
import { IAnalytics } from "../../models/Analytics.js";
import { analyticsService } from "../../service/analytics.service.js";
import parseUA from "../../utils/uaParser.js";
import { IncomingMessage, ServerResponse } from "http";


export const onProxyRes = (proxyRes: IncomingMessage, req: RequestWithProject, res: ServerResponse) => {
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

}