import { z } from "zod";
import { SessionSchema, type Session } from "@/schemas/sessions";

const API_BASE_URL = "http://localhost:3000/api";

const SessionsResponseSchema = z.array(SessionSchema);

export async function fetchSessions(): Promise<Session[]> {
  const response = await fetch(`${API_BASE_URL}/sessions`);
  if (!response.ok) {
    throw new Error("Failed to fetch sessions");
  }
  const rawData = await response.json();

  const validatedData = SessionsResponseSchema.parse(rawData);

  return validatedData;
}

export async function createSession(
  prompt?: string,
  id?: string,
): Promise<Session> {
  const response = await fetch(`${API_BASE_URL}/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, id }),
  });

  if (!response.ok) {
    throw new Error("Failed to create session");
  }

  const rawData = await response.json();
  return SessionSchema.parse(rawData);
}
