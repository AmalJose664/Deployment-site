import { ZodError } from "zod";
import DeploymentEventHandler from "./handlers/deployment.handler.js";
import { DeploymentLogEventSchema, DeploymentUpdatesEventSchema } from "./schemas/deployment.schema.js";
import { ZodObject } from "zod";

type EventHandler<T = any> = (event: T) => Promise<void>;
interface EventConfig {
    topic: string;
    schema: ZodObject;
    handler: EventHandler;

    description?: string;
}

export const EVENT_REGISTRY: Record<string, EventConfig> = {
    "deployment.logs": {
        topic: "deployment.logs",
        handler: DeploymentEventHandler.handleLogs,
        schema: DeploymentLogEventSchema,
        description: "Real-time deployment build logs",
    },
    "deployment.updates": {
        topic: "deployment.updates",
        handler: DeploymentEventHandler.handleUpdates,
        schema: DeploymentUpdatesEventSchema,
        description: "Deployment status transitions",
    },
};
const KAFKA_MESSAGE_SAVE_RETRIES = 3;
const KAFKA_MESSAGE_RETRY_INITIAL_DELAY = 750;

export function getALlTopics() {
    return Object.values(EVENT_REGISTRY).map((c) => c.topic);
}
export function getEventConfig(topic: string): EventConfig | undefined {
    return EVENT_REGISTRY[topic];
}

export async function processEvent(data: unknown, topic: string) {
    const config = getEventConfig(topic);

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
