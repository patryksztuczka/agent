import { Hono } from 'hono';
import { tryCatch } from '../../lib/try-catch';
import { AGENT_PROFILES } from '../../lib/agent-profiles';

const agents = new Hono();

agents.get('/', async (c) => {
  const { data: profiles, error } = await tryCatch(Promise.resolve(AGENT_PROFILES));

  if (error) {
    return c.json({ error: 'Failed to fetch agents' }, 500);
  }

  return c.json(profiles);
});

export default agents;
