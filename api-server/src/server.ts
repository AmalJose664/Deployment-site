
import httpServer from "./app.js";
import { startKafkaConsumer, stopKafkaConsumer } from "./events/index.js";
import { analyticsService } from "./instances.js";
const PORT = process.env.PORT || 8000;
const startServer = async () => {
	httpServer.listen(PORT, () => console.log(`🎉🎉 Server running on port ${PORT}`));
	// await startKafkaConsumer()
};

startServer().catch((e) => console.log(e));
process.on("SIGINT", async () => {
	console.log("Exiting.........");
	await stopKafkaConsumer();
	await analyticsService.exitService()
	process.exit(0);
});

process.on("SIGTERM", async () => {
	console.log("Exiting.....");
	await stopKafkaConsumer();
	await analyticsService.exitService()
	process.exit(0);
});

process.on("exit", (code) => {
	console.log(`🎊🥀 Process exited`);
});
