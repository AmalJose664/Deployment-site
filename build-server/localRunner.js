
import express from 'express';
import { Redis } from 'ioredis';

const app = express();
const listenChanel = 'build:start'
app.use(express.json());
const redis = new Redis(process.env.REDIS_URL);
redis.on('connect', () => {
	console.log('📡 Publisher connected to Redis');
});

redis.on('error', (err) => {
	console.error('❌ Redis Publisher Error:', err);
});

redis.on('ready', () => {
	console.log('✅ Redis subscriber ready');

	redis.subscribe(listenChanel, (err, count) => {
		if (err) {
			console.error('Failed to subscribe to deployment channel:', err);
			return;
		}
		console.log(`🎧 Subscribed to '${listenChanel}' channel`);
		console.log(`👂 Listening for '${listenChanel}' messages...\n`);
	});
});
redis.on('message', (channel, message) => {
	if (channel === listenChanel) {
		console.log('\n🚀 DEPLOYMENT MESSAGE RECEIVED');
		console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
		console.log(`📅 Time: ${new Date().toISOString()}`);

		try {
			const data = JSON.parse(message);
			handleDeployment(data);
		} catch (e) {
			console.log('📝 Raw Message:', message);
		}
		console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
	}
});
function handleDeployment(data) {
	console.log('⚙️  Processing deployment...');

	console.log(data)

	console.log('✅ Deployment processed successfully');
}

console.log('╔════════════════════════════════════════╗');
console.log('║   Redis Deployment Subscriber Started  ║');
console.log('╚════════════════════════════════════════╝');
console.log('Press Ctrl+C to stop\n');

app.get('/health', (req, res) => {
	res.json({ status: 'ok', service: 'redis-publisher' });
});


const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
	console.log(`🚀 local runner server running on port ${PORT}`);
});


process.on('SIGTERM', async () => {
	console.log('SIGTERM received, closing Redis connection...');
	await redis.quit();
	process.exit(0);
});