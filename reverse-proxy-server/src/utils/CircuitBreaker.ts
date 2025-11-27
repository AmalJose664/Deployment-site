class CircuitBreaker {
	private failures = 0;
	private lastFailure = Date.now();
	private readonly failureThreshold = 5;
	private readonly timeout = 5000; // 5s

	get isOpen() {
		const now = Date.now();
		const timePassed = now - this.lastFailure;

		// If open but timeout passed: half-open state
		if (this.failures >= this.failureThreshold && timePassed > this.timeout) {
			return false;
		}

		return this.failures >= this.failureThreshold;
	}

	recordFailure() {
		this.failures++;
		this.lastFailure = Date.now();
	}

	recordSuccess() {
		this.failures = 0;
	}
}
export const breaker = new CircuitBreaker()