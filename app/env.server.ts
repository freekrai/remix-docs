import { z } from "zod";

export let envSchema = z.object({
	SESSION_SECRET: z.string().min(1),
	BOT_GITHUB_TOKEN: process.env.USE_FILESYSTEM_OR_GITHUB === 'gh' ? z.string().min(1) : z.optional(z.string()),
	GITHUB_OWNER: process.env.USE_FILESYSTEM_OR_GITHUB === 'gh' ? z.string().min(1) : z.optional(z.string()),
	GITHUB_REPO: process.env.USE_FILESYSTEM_OR_GITHUB === 'gh' ? z.string().min(1) : z.optional(z.string()),
	USE_FILESYSTEM_OR_GITHUB: z
	.union([
		z.literal("fs"),
		z.literal("gh"),
	])
	.default("fs"),
	NODE_ENV: z
		.union([
			z.literal("test"),
			z.literal("development"),
			z.literal("production"),
		])
		.default("development"),
});

export type Env = z.infer<typeof envSchema>;