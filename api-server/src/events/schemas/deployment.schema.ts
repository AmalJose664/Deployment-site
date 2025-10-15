import z from "zod";
import { EventTypes, UpdateTypes } from "../types/event.js";
import { mongoIdSchema } from "../../dtos/zodHelpers.js";
import { DeploymentStatus } from "../../models/Deployment.js";


export const DeploymentLogEventSchema = z.object({
	eventId: z.uuidv4(),
	eventType: z.enum(Object.values(EventTypes)),
	data: z.object({
		deploymentId: mongoIdSchema,
		projectId: mongoIdSchema,
		log: z.object({
			level: z.string(),
			message: z.string(),
			timestamp: z.iso.datetime(),
			stream: z.string()
		})
	})
})

export const DeploymentUpdatesEventSchema = z.object({
	eventId: z.uuidv4(),
	eventType: z.enum(Object.values(EventTypes)),
	data: z.object({
		deploymentId: mongoIdSchema,
		projectId: mongoIdSchema,
		updateType: z.enum(Object.values(UpdateTypes)),
		updates: z.object({
			status: z.enum(Object.values(DeploymentStatus)).optional(),
			commit_hash: z.string().optional(),
			error_message: z.string().optional(),
			duration_ms: z.number().optional(),
			complete_at: z.iso.datetime().optional()
		})
	})
})
export type DeploymentLogEvent = z.infer<typeof DeploymentLogEventSchema>;
export type DeploymentUpdatesEvent = z.infer<typeof DeploymentUpdatesEventSchema>;