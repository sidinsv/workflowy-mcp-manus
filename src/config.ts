import { z } from "zod";

export const configSchema = z.object({
  apiKey: z
    .string()
    .describe("Your WorkFlowy API key from https://beta.workflowy.com/api-reference/"),

  cacheEnabled: z
    .boolean()
    .default(true)
    .describe("Enable local caching for search (recommended)"),

  cacheTTL: z
    .number()
    .default(3600)
    .describe("Cache time-to-live in seconds (default: 1 hour)"),
});

export type Config = z.infer<typeof configSchema>;
