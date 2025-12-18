type envsArrayType = { name: string; value: string }[];
const REQUIRED_ENVS = [
	"API_ENDPOINT",
	"CONTAINER_API_TOKEN",
	"AWS_ACCESSKEY",
	"AWS_SECRETKEY",
	"AWS_S3_BUCKET",
	"KAFKA_USERNAME",
	"KAFKA_PASSWORD",
	"STORAGE_SERVER_ENDPOINT",
] as const;

const getNessesaryEnvs = (): envsArrayType => {
	const envsArray: envsArrayType = [];
	const missing: string[] = [];
	for (const envName of REQUIRED_ENVS) {
		const value = process.env[envName];

		if (!value) {
			missing.push(envName);
		}
		envsArray.push({ name: envName, value: value || "" });
	}

	if (missing.length > 0) {
		console.log(`Missing required environment variables : ${missing.join(", ")}`);
		throw new Error(`Server Error Missing required environment variables : ${missing.join(", ")}`);
	}
	return envsArray;
};
export default getNessesaryEnvs;
