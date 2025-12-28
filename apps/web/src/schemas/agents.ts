import { z } from 'zod';

export const AgentSchema = z.object({
  id: z.number(),
  name: z.string(),
  systemPrompt: z.string(),
});

export type Agent = z.infer<typeof AgentSchema>;
