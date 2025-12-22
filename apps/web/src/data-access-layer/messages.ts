import { z } from "zod";
import { MessageSchema, type Message } from "@/schemas/messages";

const API_BASE_URL = "http://localhost:3000/api";

const MessagesResponseSchema = z.array(MessageSchema);

export async function fetchMessages(sessionId: string): Promise<Message[]> {
  const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/messages`);
  
  if (!response.ok) {
    // If session doesn't exist yet, it's fine to return empty messages
    if (response.status === 404) {
      return [];
    }
    throw new Error("Failed to fetch messages");
  }
  
  const rawData = await response.json();
  const validatedData = MessagesResponseSchema.parse(rawData);
  
  return validatedData;
}

export async function sendMessage(sessionId: string, prompt: string): Promise<Message> {
  const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  const rawData = await response.json();
  return MessageSchema.parse(rawData);
}
