import { Hono } from 'hono';
import { prisma } from '../../lib/prisma';

const sessions = new Hono();

sessions.get('/', async (c) => {
  const allSessions = await prisma.session.findMany({
    select: {
      id: true,
      name: true,
      lastMessageAt: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      lastMessageAt: 'desc',
    },
  });

  return c.json(allSessions);
});

export default sessions;
