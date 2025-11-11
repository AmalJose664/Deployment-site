import { IAnalyticsRepository } from "../interfaces/repository/IAnalyticsRepository.js";
import { IAnalyticsService } from "../interfaces/service/IAnalyticsService.js";
import { BufferAnalytics } from "../models/Analytics.js";


class AnalyticsService implements IAnalyticsService {
	private analyticsRepo: IAnalyticsRepository

	private analyticsBuffer: BufferAnalytics[] = [];
	private readonly BATCH_SIZE = 170;
	private readonly FLUSH_INTERVAL = 7000; // 7s
	private readonly MAX_BUFFER_SIZE = 10000;
	private flushTimer?: NodeJS.Timeout;
	private isFlushing = false;


	constructor(analyticsRepo: IAnalyticsRepository) {
		this.analyticsRepo = analyticsRepo
		this.startFlushTimer()

	}

	private startFlushTimer(): void {
		this.flushTimer = setInterval(() => {
			if (this.analyticsBuffer.length > 0) {
				this.saveBatch().catch(console.error);
			}
		}, this.FLUSH_INTERVAL);

	}
	async saveBatch(): Promise<void> {
		console.log("saving ....", this.analyticsBuffer.length)
		if (this.isFlushing || this.analyticsBuffer.length === 0) {
			console.log("returning ...")
			return;
		}

		this.isFlushing = true
		const batch = this.analyticsBuffer.splice(0, this.BATCH_SIZE)
		try {
			await this.analyticsRepo.insertBatch(batch);
			console.log(`✅ Saved ${batch.length} analytics events`);
		} catch (error) {
			console.error('save analytics error:', error, "Discarding data");

		} finally {
			this.isFlushing = false;
		}
	}

	async addEvent(event: BufferAnalytics): Promise<void> {
		if (this.analyticsBuffer.length >= this.MAX_BUFFER_SIZE) {
			console.warn('Analytics buffer full, dropping oldest events');
			this.analyticsBuffer.splice(0, 1000);
		}
		this.analyticsBuffer.push(event);

		if (this.analyticsBuffer.length >= this.BATCH_SIZE) {
			this.saveBatch();
		}
	}
	async addEventBatch(event: BufferAnalytics[]): Promise<void> {
		if (this.analyticsBuffer.length >= this.MAX_BUFFER_SIZE) {
			console.warn('Analytics buffer full, dropping oldest events');
			this.analyticsBuffer.splice(0, 1000);
		}
		this.analyticsBuffer.push(...event);

		if (this.analyticsBuffer.length >= this.BATCH_SIZE) {
			this.saveBatch();
		}
	}

	async exitService(): Promise<void> {
		console.log("service cleaning....")
		clearInterval(this.flushTimer)
		while (this.analyticsBuffer.length > 0) {
			await this.saveBatch()
		}
	}


}

export default AnalyticsService