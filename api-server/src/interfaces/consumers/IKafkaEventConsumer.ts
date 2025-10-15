export interface IKafkaEventConsumer {
	start(): Promise<void>
	stop(): Promise<void>
}