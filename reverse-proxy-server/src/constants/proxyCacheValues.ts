export const exemptedRegex: RegExp[] = [
	/\/favicon(?:\/|$)/,
	/\/\.well-known(?:\/|$)/,
	/\/robots\.txt$/,
	/\/sitemap\.xml$/,
];

export const MAX_CACHE_LIMIT_MB = 4 * 1024 * 1024;