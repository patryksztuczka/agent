import { z } from "zod";
import { MessageSchema, type Message } from "@/schemas/messages";

const API_BASE_URL = "http://localhost:3000/api";

const MessagesResponseSchema = z.array(MessageSchema);

export async function fetchMessages(sessionId: string): Promise<Message[]> {
  const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/messages`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Session not found");
    }
    throw new Error("Failed to fetch messages");
  }
  
  const rawData = await response.json();
  const validatedData = MessagesResponseSchema.parse(rawData);
  
  return validatedData;
}
