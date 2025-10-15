import httpServer from "./app.js";
const PORT = process.env.PORT || 8000;
const startServer = async () => {
	httpServer.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
	// await startConsumers();
};

startServer().catch((e) => console.log(e));
process.on("SIGINT", async () => {
	console.log("Exiting.........");
	// await stopConsumers();
	process.exit(0);
});

process.on("SIGTERM", async () => {
	console.log("Exiting.....");
	// await stopConsumers();
	process.exit(0);
});

process.on("exit", (code) => {
	console.log(`👋 Process exited`);
});
