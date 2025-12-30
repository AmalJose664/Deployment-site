
import { execa } from 'execa';
import express from 'express';
import { Redis } from 'ioredis';
import PQueue from 'p-queue';
const app = express();
const concurrency = Number(process.env.CONCURRENCY_OF_PROCESS || 3) || 3
const processQueue = new PQueue({ concurrency: concurrency });

const MAX_PENDING = 5;

processQueue.onIdle().then(() => console.log('All tasks done'));
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
redis.on('message', async (channel, message) => {
	if (channel === listenChanel) {
		console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

		try {
			const data = JSON.parse(message);
			await handleDeployment(data);
		} catch (e) {
			console.log('📝 Raw Message:', message);
		}
		console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
	}
});

async function handleDeployment(data) {
	// if (processQueue.size + processQueue.pending >= MAX_PENDING) {
	// 	console.log("returning MAX Reached");
	// 	return
	// }
	// processQueue.add(() =>
	// 	execa('node', ['test.js']).then(result => {
	// 		console.log(`${result} finished`);
	// 	}))


	console.log('\n------');
}

console.log('╔════════════════════════════════════════╗');
console.log('║   Redis Deployment Subscriber Started  ║');
console.log('╚════════════════════════════════════════╝');


app.get('/health', (req, res) => {
	res.json({ status: 'ok', service: 'redis-publisher' });
});


const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
	console.log(`🚀 local runner server running on port ${PORT}`);
	console.log(`Runner running with concorrency of ${concurrency}`);
});


process.on('SIGTERM', async () => {
	console.log('SIGTERM received, closing Redis connection...');
	await redis.quit();
	process.exit(0);
});