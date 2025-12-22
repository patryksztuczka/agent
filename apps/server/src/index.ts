import { Hono } from 'hono';

import { prisma } from './lib/prisma';

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.get('/sessions', async (c) => {
  const sessions = await prisma.session.findMany({
    include: { messages: true },
    orderBy: { lastMessageAt: 'desc' },
  });
  return c.json(sessions);
});

export default app;
