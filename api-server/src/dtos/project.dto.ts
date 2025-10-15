import z from "zod";
import { ProjectStatus } from "../models/Projects.js";

export const envSchema = z
    .object({
        name: z
            .string()
            .min(1, "Name is required")
            .max(100, "Name too long")
            .regex(/^[A-Z_][A-Z0-9_]*$/, "Name must be uppercase with underscores"),
        value: z.string().max(5000, "Value too long"),
    })
    .strict();

export const CreateProjectSchema = z.object({
    name: z
        .string()
        .min(3, "Name should be at least 3 charecters")
        .min(3, "Name should not exceed 3 charecters")
        .regex(/^[a-z0-9-]+$/, "Project name can only contain lowercase letters, numbers, and hyphens")
        .refine((name) => !name.startsWith("-") && !name.endsWith("-"), "Project name cannot start or end with hyphen"),
    repoURL: z
        .string()
        .regex(/^(?:https?:\/\/(?:www\.)?github\.com\/)?[\w-]+\/[\w.-]+\/?$/, "Invalid repository format (expected: owner/repo or full GitHub URL)"),
    branch: z.string().optional().default("main"),
    buildCommand: z.string().optional().default("build"),
    rootDir: z.string().optional().default("/"),
    outputDirectory: z.string().optional().default("dist"),
    installCommand: z.string().optional().default("install"),
    env: z.array(envSchema).max(100).default([]).optional(),
});

export const UpdateProjectScheme = CreateProjectSchema.partial()
    .extend({
        projectId: z.string(),
    })
    .strict();

export const ProjectQueryScheme = z
    .object({
        status: z.enum(Object.values(ProjectStatus)).optional(),
        page: z.preprocess((v) => Number(v) || 1, z.number().int().positive()),
        limit: z.preprocess((v) => Number(v) || 10, z.number().int().min(1).max(100)),
        search: z.string().max(100).optional().default(""),
    })
    .strict();

export type CreateProjectDTO = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectDTO = z.infer<typeof UpdateProjectScheme>;
export type QueryProjectDTO = z.infer<typeof ProjectQueryScheme>;
