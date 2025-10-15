import DeploymentEventHandler from "./handlers/deployment.handler.js"
import { DeploymentLogEventSchema, DeploymentUpdatesEventSchema } from "./schemas/deployment.schema.js";
import { ZodObject } from "zod";

type EventHandler<T = any> = (event: T) => Promise<void>;
interface EventConfig {
	topic: string;
	schema: ZodObject
	handler: EventHandler;

	description?: string;
}

export const EVENT_REGISTRY: Record<string, EventConfig> = {
	"deployment.logs": {
		topic: 'deployment.logs',
		handler: DeploymentEventHandler.handleLogs,
		schema: DeploymentLogEventSchema,
		description: 'Real-time deployment build logs'
	},
	"deployment.updates": {
		topic: 'deployment.updates',
		handler: DeploymentEventHandler.handleUpdates,
		schema: DeploymentUpdatesEventSchema,
		description: 'Deployment status transitions'
	}
}
export function getALlTopics() {
	return Object.values(EVENT_REGISTRY).map((c) => c.topic)
}
export function getEventConfig(topic: string): EventConfig | undefined {
	return EVENT_REGISTRY[topic];
}

export async function processEvent(data: unknown, topic: string) {
	const config = getEventConfig(topic)

	if (!config) {
		throw new Error(`No handler registered for topic: ${topic}`);
	}
	const parsedData = config.schema.parse(data)

	await config.handler(parsedData)
}
