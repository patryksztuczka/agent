import { Hono } from 'hono';
import { prisma } from '../../lib/prisma';
import messages from '../messages/messages.controller';

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

sessions.route('/:id/messages', messages);

export default sessions;
