import { ZodObject } from "zod";

export type EventHandler<T = any> = (event: T, isRetry: boolean) => Promise<void>;

export enum EventTypes {
	DEPLOYMENT_LOG = "DEPLOYMENT_LOG",
	DEPLOYMENT_UPDATES = "DEPLOYMENT_UPDATES",
}
export enum UpdateTypes {
	START = "START",
	ERROR = "ERROR",
	CUSTOM = "CUSTOM",
	END = "END",
}

export interface EventConfig {
	topic: string;
	schema: ZodObject;
	handler: EventHandler;
	processFn: (data: any | unknown, topic: string, type: "logs" | "analytics") => Promise<void>;
	description?: string;
}

export type EventRegistryType = Record<string, Record<string, EventConfig>>;
