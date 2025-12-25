import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
	region: "auto",
	credentials: {
		accessKeyId: process.env.CLOUD_STORAGE_SERVER_ACCESS_KEY as string,
		secretAccessKey: process.env.CLOUD_STORAGE_SERVER_ACCESS_SECRET as string,
	},
	endpoint: process.env.CLOUD_STORAGE_SERVER_ENDPOINT as string,
	forcePathStyle: true
})
