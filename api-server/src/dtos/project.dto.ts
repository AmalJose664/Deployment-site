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
    buildCommand: z
        .string()
        .regex(/^[a-zA-Z0-9_\-./ ]+$/, "Build command contains invalid characters")
        .optional()
        .default("build"),
    installCommand: z
        .string()
        .regex(/^[a-zA-Z0-9_\-./ ]+$/, "Install command contains invalid characters")
        .optional()
        .default("install"),
    rootDir: z
        .string()
        .trim()
        .min(1, "Root directory cannot be empty")
        .regex(
            /^\/(?!\.\.)[a-zA-Z0-9\/_-]*$/,
            "Path must start with / and contain only alphanumeric characters, hyphens, underscores, and forward slashes",
        )
        .refine(
            (path) => !path.includes("..") && !["/etc", "/root", "/sys", "/proc", "/dev"].some((dir) => path.startsWith(dir)),
            "Invalid or restricted path",
        )
        .default("/")
        .catch("/")
        .optional(),
    outputDirectory: z.string().optional().default("dist"),
    env: z.array(envSchema).max(100).default([]).optional(),
});

export const UpdateProjectScheme = z.object({
    name: z
        .string()
        .min(3, "Name should be at least 3 charecters")
        .min(3, "Name should not exceed 3 charecters")
        .regex(/^[a-z0-9-]+$/, "Project name can only contain lowercase letters, numbers, and hyphens")
        .refine((name) => !name.startsWith("-") && !name.endsWith("-"), "Project name cannot start or end with hyphen")
        .optional(),
    branch: z.string().optional(),
    buildCommand: z
        .string()
        .regex(/^[a-zA-Z0-9_\-./ ]+$/, "Build command contains invalid characters")
        .optional(),
    installCommand: z
        .string()
        .regex(/^[a-zA-Z0-9_\-./ ]+$/, "Install command contains invalid characters")
        .optional(),
    rootDir: z
        .string()
        .trim()
        .min(1, "Root directory cannot be empty")
        .regex(
            /^\/(?!\.\.)[a-zA-Z0-9\/_-]*$/,
            "Path must start with / and contain only alphanumeric characters, hyphens, underscores, and forward slashes",
        )
        .refine(
            (path) => !path.includes("..") && !["/etc", "/root", "/sys", "/proc", "/dev"].some((dir) => path.startsWith(dir)),
            "Invalid or restricted path",
        )
        .catch("/")
        .optional(),
    outputDirectory: z.string().optional(),
    env: z.array(envSchema).max(100).optional(),
    isDisabled: z.boolean().optional(),
    projectId: z.string(),
});

export const ProjectQueryScheme = z
    .object({
        status: z.enum(Object.values(ProjectStatus)).optional(),
        page: z.coerce.number().int().positive().default(1),
        limit: z.coerce.number().int().min(1).max(100).default(10),
        search: z.string().max(100).optional().default(""),
        include: z.string().optional(),
    })
    .strict();

export type CreateProjectDTO = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectDTO = z.infer<typeof UpdateProjectScheme>;
export type QueryProjectDTO = z.infer<typeof ProjectQueryScheme>;
