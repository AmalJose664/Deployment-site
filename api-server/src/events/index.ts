import { kafka } from "../config/kafka.js";
import KafkaEventConsumer from "./consumers.js";

let consumersInstance: KafkaEventConsumer | null = null;

export async function startKafkaConsumer(): Promise<void> {
    consumersInstance = new KafkaEventConsumer(kafka);
    await consumersInstance.start();
}

export async function stopKafkaConsumer(): Promise<void> {
    if (consumersInstance) {
        await consumersInstance.stop();
    }
}
