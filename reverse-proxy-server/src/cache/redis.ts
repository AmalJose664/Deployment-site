import { Redis } from 'ioredis';
import { redisClient } from '../config/redis.config.js';
import { IRedisCache } from '../interfaces/cache/IRedis.js';

class RedisService implements IRedisCache {
	private client: Redis;

	constructor(client: Redis) {
		this.client = client;
	}

	async get<T>(key: string): Promise<T | null> {
		const value = await this.client.get(key);
		return value ? JSON.parse(value) : null;
	}

	async set(
		key: string,
		value: unknown,
		ttlSeconds?: number
	): Promise<void> {
		const data = JSON.stringify(value);

		if (ttlSeconds) {
			await this.client.set(key, data, 'EX', ttlSeconds);
		} else {
			await this.client.set(key, data, "EX", 10);
		}
	}

	async del(key: string): Promise<void> {
		await this.client.del(key);
	}

	async exists(key: string): Promise<boolean> {
		return (await this.client.exists(key)) === 1;
	}

	async disconnect(): Promise<void> {
		await this.client.quit();
	}
}

export const redisService = new RedisService(redisClient)