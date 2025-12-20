import { Request, Response, NextFunction } from "express"
import { projectService } from "../service/project.service.js"
import { redisService } from "../cache/redis.js"
import { ICacheAnalytics } from "../interfaces/cache/IRedis.js"
import { IAnalytics } from "../models/Analytics.js"
import parseUA from "../utils/uaParser.js"
import { isbot } from "isbot"
import { analyticsService } from "../service/analytics.service.js"
import { varyResponseTimeHuman } from "../utils/variateResponse.js"
export const invalidateSlugs = (req: Request, res: Response, next: NextFunction) => {
	const slug = req.params.slug
	if (!slug) {
		return res.json({ changed: false })
	}
	const result = projectService.invalidateSlug(slug)
	return res.json({ changed: result })

}

export const trackCacheAnalytics = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const ownDomain = process.env.OWN_DOMAIN
		const path = req.header("X-Original-URI")
		const ip = req.header("X-Real-IP")
		const host = req.header("X-Host") || ""
		const uaAgent = req.header("X-Ua-Agent")

		const slug = host.split('.')[0];
		if (!slug || slug === ownDomain || slug === 'www') {
			console.log(slug)
			res.status(400).json({});
			console.log("returned , no slug")
			return;
		}

		const cacheKey = slug + path
		const cache = await redisService.get<ICacheAnalytics | null>(cacheKey)
		if (!cache || !path) {
			res.json({})
			console.log("returned , no cache")
			return
		}
		const { projectId, responseSize, responseTime } = cache
		if (!projectId) {
			res.json({})
			console.log("returned , no projectid")
			return
		}
		const ua = parseUA(uaAgent || "")
		const isBot = isbot(uaAgent)
		const data: IAnalytics = {
			projectId,
			subdomain: req.project?.subdomain || "",
			timestamp: new Date().getTime(),
			path,
			requestSize: 10,
			responseSize,
			responseTime: varyResponseTimeHuman(Number(responseTime)),
			ip: ip || "0.0.0.0",
			statusCode: 304,
			uaBrowser: ua.browser,
			uaOs: ua.os,
			isMobile: ua.isMobile,
			isBot,
			referer: req.headers['referer'] || ""
		}
		// console.log(JSON.stringify(data))
		analyticsService.sendAnalytics(data)
		res.json({})
	} catch (error) {
		next(error)
	}

}