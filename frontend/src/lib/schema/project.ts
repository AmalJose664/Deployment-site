import { z } from "zod"
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


export const ProjectFormSchema = z.object({
	name: z
		.string()
		.min(3, "Name should be at least 3 charecters")
		.max(50, "Max 50 characters")
		.regex(/^[a-z0-9-]+$/, "Project name can only contain lowercase letters, numbers, and hyphens")
		.refine((name) => !name.startsWith("-") && !name.endsWith("-"), "Project name cannot start or end with hyphen"),

	repoURL: z
		.string()
		.regex(/^(?:https?:\/\/(?:www\.)?github\.com\/)?[\w-]+\/[\w.-]+\/?$/, "Invalid repository format (expected: owner/repo or full GitHub URL)")
	,
	branch: z.string().optional().default("main").optional(),

	buildCommand: z
		.string()
		.trim()
		.min(1, "Build command cannot be empty")
		.regex(/^[a-zA-Z0-9_\-./ ]+$/, "Build command contains invalid characters")
		.catch("build")
		.optional(),

	installCommand: z
		.string()
		.trim()
		.min(1, "Install command cannot be empty")
		.regex(/^[a-zA-Z0-9_\-./ ]+$/, "Install command contains invalid characters")
		.default("install")
		.catch("install")
		.optional(),

	rootDir: z
		.string()
		.trim()
		.min(1, "Root directory cannot be empty")
		.default("/")
		.catch("/")
		.optional(),

	outputDirectory: z
		.string()
		.trim()
		.min(1, "Output directory cannot be empty")
		.default("dist")
		.catch("dist")
		.optional(),

	env: z
		.array(envSchema)
		.max(100, "You can define up to 100 environment variables only")
		.default([])
		.optional(),
});
export type ProjectFormType = z.infer<typeof ProjectFormSchema>