export function varyResponseTimeHuman(ms: number, variationPercent = 50) {
	const maxVariation = ms * (variationPercent / 100);

	const randomFactor =
		(Math.random() + Math.random() + Math.random()) / 3; // bell-ish curve

	const variation = (randomFactor - 0.5) * 2 * maxVariation;
	let result = ms + variation;

	result = Math.max(0, result);

	return Number(result.toFixed(2));
}