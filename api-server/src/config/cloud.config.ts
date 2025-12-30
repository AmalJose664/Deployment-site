import { ECSClient } from "@aws-sdk/client-ecs";
import { S3Client } from "@aws-sdk/client-s3";

export const ecsClient = new ECSClient({
	region: "us-east-1",
	credentials: {
		accessKeyId: process.env.CLOUD_ACCESSKEY as string,
		secretAccessKey: process.env.CLOUD_SECRETKEY as string,
	},
});

export const s3Client = new S3Client({
	region: "auto",
	credentials: {
		accessKeyId: process.env.CLOUD_ACCESSKEY as string,
		secretAccessKey: process.env.CLOUD_SECRETKEY as string,
	},
	endpoint: process.env.CLOUD_ENDPOINT,
	forcePathStyle: true
});

export const config = {
	CLUSTER: process.env.CLUSTER_ARN as string,
	TASK: process.env.TASK_ARN as string,
};
