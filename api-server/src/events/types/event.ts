import { ZodObject } from "zod";

export type EventHandler<T = any> = (event: T) => Promise<void>;
export interface EventConfig {
    topic: string;
    handler: EventHandler;
    schema: ZodObject;
    description?: string;
    type: EventTypes;
}
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
