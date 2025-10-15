import { ECSClient } from "@aws-sdk/client-ecs";

export const ecsClient = new ECSClient({
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESSKEY as string,
        secretAccessKey: process.env.AWS_SECRETKEY as string,
    },
});

export const config = {
    CLUSTER: process.env.CLUSTER_ARN as string,
    TASK: process.env.TASK_ARN as string,
};
