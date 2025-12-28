import { z } from "zod";

export const MessageRoleEnum = z.enum(['user', 'assistant']);

export const MessageSchema = z.object({
  id: z.string(),
  role: z.string(),
  content: z.string().min(1),
  createdAt: z.union([z.string(), z.date()]).transform((val) => new Date(val)),
  sessionId: z.string(),
});

export type Message = z.infer<typeof MessageSchema>;
