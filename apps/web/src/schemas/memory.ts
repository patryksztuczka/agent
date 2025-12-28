import { z } from "zod";
import { MessageSchema } from "./messages";

export const SessionContextSchema = z.object({
  summary: z.object({
    content: z.string(),
    count: z.number(),
  }).nullable(),
  messages: z.array(MessageSchema),
});

export type SessionContext = z.infer<typeof SessionContextSchema>;
