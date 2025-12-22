import { Hono } from 'hono';
import { prisma } from '../../lib/prisma';

const messages = new Hono();

messages.get('/', async (c) => {
  const sessionId = c.req.param('id');

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    return c.json({ error: 'Session not found' }, 404);
  }

  const allMessages = await prisma.message.findMany({
    where: { sessionId },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return c.json(allMessages);
});

export default messages;
