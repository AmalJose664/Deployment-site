export function validateEnv() {
	const required = [
		"MONGO_URL",
		"OWN_DOMAIN",
		"KAFKA_USERNAME",
		"KAFKA_PASSWORD",
		"AWS_STORAGE_BUCKET_NAME",
		"NON_AWS_STORAGE_SERVER_URL"
	];

	const missing = required.filter(key => !process.env[key]);

	if (missing.length > 0) {
		console.error('❌ Missing required environment variables:');
		console.error(missing.join(', '));
		process.exit(1);
	}

	console.log('✅ All environment variables validated');
}