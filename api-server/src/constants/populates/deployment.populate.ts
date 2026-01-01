export const DEPLOYMENT_POPULATE_MAP = {
	user: {
		path: "user",
		select: "name email profileImage"
	},
	project: {
		path: "project",
		select: "name branch subdomain repoURL"
	}
} as const