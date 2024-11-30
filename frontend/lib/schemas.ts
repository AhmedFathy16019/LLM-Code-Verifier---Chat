import { z } from 'zod';

const inputSchema = z.object({
    prompt: z.string(),
    entryPoint: z.optional(z.string()),
    temperature: z.optional(z.coerce.number()),
    timeout: z.optional(z.coerce.number()),
    floatThreshold: z.optional(z.coerce.number()),
    ignoreListOrder: z.optional(z.boolean()),
    ignoreStringCase: z.optional(z.boolean()),
})

const registerSchema = z.object({
    username: z.string(),
    password: z.string(),
    apiKey: z.string(),
});

const loginSchema = z.object({
    username: z.string(),
    password: z.string(),
});

export type RegisterSchema = z.infer<typeof registerSchema>;

export type InputSchema = z.infer<typeof inputSchema>;

export type LoginSchema = z.infer<typeof loginSchema>;

export { registerSchema, inputSchema, loginSchema };