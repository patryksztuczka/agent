import { z } from "zod";

export const SessionSchema = z.object({
  id: z.string(),
  name: z.string(),
  lastMessageAt: z.string().transform((val) => new Date(val)),
  userId: z.string(),
  createdAt: z.string().transform((val) => new Date(val)),
  updatedAt: z.string().transform((val) => new Date(val)),
});

export type Session = z.infer<typeof SessionSchema>;
