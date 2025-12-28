import { z } from 'zod';
import { AgentSchema, type Agent } from '@/schemas/agents';

const API_BASE_URL = 'http://localhost:3000/api';

const AgentsResponseSchema = z.array(AgentSchema);

export async function fetchAgents(): Promise<Agent[]> {
  const response = await fetch(`${API_BASE_URL}/agents`);
  if (!response.ok) {
    throw new Error('Failed to fetch agents');
  }
  const rawData = await response.json();

  const validatedData = AgentsResponseSchema.parse(rawData);

  return validatedData;
}
