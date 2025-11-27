import { Request, Response, NextFunction } from "express"
import { projectService } from "../service/project.service.js"
export const invalidateSlugs = (req: Request, res: Response, next: NextFunction) => {
	const slug = req.params.slug
	if (!slug) {
		return res.json({ changed: false })
	}
	const result = projectService.invalidateSlug(slug)
	return res.json({ changed: result })

}