import { ZodError } from "zod";
import DeploymentEventHandler from "./handlers/deployment.handler.js";
import { DeploymentLogEventSchema, DeploymentUpdatesEventSchema } from "./schemas/deployment.schema.js";
import ProjectAnalyticsHandler from "./handlers/analytics.handler.js";
import { analyticsEventSchema } from "./schemas/analytics.schema.js";
import { EventConfig, EventRegistryType } from "./types/event.js";



export const EVENT_REGISTRY: EventRegistryType = {
	logs: {
		"deployment.logs": {
			topic: "deployment.logs",     // <------- Actual kafka topic name
			handler: DeploymentEventHandler.handleLogs,
			schema: DeploymentLogEventSchema,
			processFn: processLogEvent,
			description: "Real-time deployment build logs",
		},
		"deployment.updates": {
			topic: "deployment.updates",     // <------- Actual kafka topic name
			handler: DeploymentEventHandler.handleUpdates,
			processFn: processLogEvent,
			schema: DeploymentUpdatesEventSchema,
			description: "Deployment, Project status transitions, data updations",
		},
	},
	analytics: {
		"project.analytics": {
			topic: "project.analytics",     // <------- Actual kafka topic name
			handler: ProjectAnalyticsHandler.handleDataBatch,
			processFn: processAnalyticsEvent,
			schema: analyticsEventSchema,
			description: "Project analytics"
		}
	}
};

const KAFKA_MESSAGE_SAVE_RETRIES = 3;
const KAFKA_MESSAGE_RETRY_INITIAL_DELAY = 750;


export function getAllTopics() {
	return Object.values(EVENT_REGISTRY).map((types) => Object.values(types).map(field => field.topic));
}
export function getEventConfig(topic: string, type: "logs" | "analytics"): EventConfig | undefined {
	return EVENT_REGISTRY[type][topic];
}
export function getEventProcessFn(topic: string, type: "logs" | "analytics"): EventConfig['processFn'] {
	return EVENT_REGISTRY[type][topic].processFn;
}
export function getEventSchema(topic: string, type: "logs" | "analytics"): EventConfig['schema'] {
	return EVENT_REGISTRY[type][topic].schema;
}



export async function processLogEvent(data: unknown, topic: string, type: "logs" | "analytics") {
	const config = getEventConfig(topic, type);

	if (!config) {
		throw new Error(`No handler registered for topic: ${topic}`);
	}
	let attempt = 0;
	let processed = false;

	while (!processed && attempt < KAFKA_MESSAGE_SAVE_RETRIES) {
		try {
			const parsedData = config.schema.parse(data);
			await config.handler(parsedData);
			processed = true;
		} catch (error: any) {
			if (error instanceof ZodError) {
				console.log("Error on parsing data ", error, data, "\nReturning...");
				return;
			}
			if (topic.endsWith("analytics")) {
				console.log("Retrying skiped .....")
				return
			}
			attempt++;
			console.error(`Error processing message (attempt ${attempt}):`, {
				value: data,
				error: error.message,
			});
			if (attempt < KAFKA_MESSAGE_SAVE_RETRIES && !processed) {
				const baseDelay = KAFKA_MESSAGE_RETRY_INITIAL_DELAY * 2 ** (attempt - 1);
				const jitter = Math.random() * 0.3 * baseDelay;
				const delay = Math.min(baseDelay + jitter, 30000);
				await new Promise((resolve) => setTimeout(resolve, delay));
			} else {
				console.log("Max retries reached skipping message");
			}
		}
	}
}


export async function processAnalyticsEvent(data: unknown | unknown[], topic: string, type: "logs" | "analytics") {
	const config = getEventConfig(topic, type);

	if (!config) {
		throw new Error(`No handler registered for topic: ${topic}`);
	}

	await config.handler(data);
}