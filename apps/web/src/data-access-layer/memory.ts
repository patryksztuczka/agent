import { SessionContextSchema, type SessionContext } from "@/schemas/memory";

const API_BASE_URL = "http://localhost:3000/api";

export async function fetchSessionContext(sessionId: string): Promise<SessionContext | null> {
  const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/messages/context`);
  
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error("Failed to fetch session context");
  }

  const rawData = await response.json();
  return SessionContextSchema.parse(rawData);
}
