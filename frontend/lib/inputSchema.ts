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

export type InputSchema = z.infer<typeof inputSchema>;

export default inputSchema;
