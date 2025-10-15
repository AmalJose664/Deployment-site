import z from "zod";
import { mongoIdSchema } from "./zodHelpers.js";

export const createDeploymentSchema = z.object({
    projectId: mongoIdSchema,
});
