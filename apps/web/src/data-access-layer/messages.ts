import { z } from "zod";
import { MessageSchema, type Message } from "@/schemas/messages";

const API_BASE_URL = "http://localhost:3000/api";

const MessagesResponseSchema = z.array(MessageSchema);

export async function fetchMessages(sessionId: string): Promise<Message[]> {
  const response = await fetch(
    `${API_BASE_URL}/sessions/${sessionId}/messages`,
  );

  if (!response.ok) {
    if (response.status === 404) {
      return [];
    }
    throw new Error("Failed to fetch messages");
  }

  const rawData = await response.json();
  const validatedData = MessagesResponseSchema.parse(rawData);

  return validatedData;
}

export async function saveMessage(
  sessionId: string,
  prompt: string,
): Promise<Message> {
  const response = await fetch(
    `${API_BASE_URL}/sessions/${sessionId}/messages`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to save message");
  }

  const rawData = await response.json();
  return MessageSchema.parse(rawData);
}

export async function* getCompletion(
  sessionId: string,
): AsyncGenerator<string> {
  const response = await fetch(
    `${API_BASE_URL}/sessions/${sessionId}/messages/completion`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to get completion");
  }

  const reader = response.body?.getReader();

  if (!reader) {
    throw new Error("Response body is not readable");
  }

  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      yield decoder.decode(value, { stream: true });
    }
  } finally {
    reader.releaseLock();
  }
}
