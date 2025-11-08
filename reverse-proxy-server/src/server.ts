import app from "./app.js";
import { analyticsClean } from "./utils/analyticsCleaner.js";
const PORT = process.env.PORT || 7000;
const startServer = async () => {
	app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
};
startServer().catch((e) => console.log(e));


process.once('SIGTERM', () => async () => {
	await analyticsClean()
	process.exit(0);
});
process.once('SIGINT', async () => {
	await analyticsClean()
	process.exit(0);
});

process.once('uncaughtException', async (error) => {
	console.error('Uncaught exception:', error);
	await analyticsClean()
	process.exit(0)
});
