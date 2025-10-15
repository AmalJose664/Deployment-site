import DeploymentEventHandler from "./handlers/deployment.handler.js"

type EventHandler<T = any> = (event: T) => Promise<void>;
interface EventConfig {
	topic: string;
	handler: EventHandler;
	description?: string;
}

export const EVENT_REGISTRY: Record<string, EventConfig> = {
	"deployment.logs": {
		topic: 'deployment.logs',
		handler: DeploymentEventHandler.handleLogs,
		description: 'Real-time deployment build logs'
	},
	"deployment.status": {
		topic: 'deployment.updates',
		handler: DeploymentEventHandler.handleStatusChange,
		description: 'Deployment status transitions'
	}
}
export function getALlTopics() {
	return Object.values(EVENT_REGISTRY).map((c) => c.topic)
}
export function getEventConfig(topic: string): EventConfig | undefined {
	return EVENT_REGISTRY[topic];
}

export function processEvent(data: unknown, topic: string) {
	const config = getEventConfig(topic)

	if (!config) {
		throw new Error(`No handler registered for topic: ${topic}`);
	}
	config.handler(data)
}
