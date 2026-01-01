export const PROJECT_POPULATE_MAP = {
	user: {
		path: "user",
		select: "name email profileImage"
	},
	deployments: {
		path: "deployments",
		select: "status createdAt"
	}
} as const