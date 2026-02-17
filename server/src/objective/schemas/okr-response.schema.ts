import { z } from 'zod';

export const OkrResponseSchema = z.object({
  title: z.string().describe('Refined, concise, outcome-focused objective'),
  keyResults: z
    .array(
      z.object({
        description: z.string().describe('Measurable, outcome-based statement'),
        progress: z.number().int().min(0).max(100).default(0),
      }),
    )
    .describe('List of key results'),
});

export type OkrResponse = z.infer<typeof OkrResponseSchema>;
