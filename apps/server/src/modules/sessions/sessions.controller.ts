import { Hono } from 'hono';
import { google } from '@ai-sdk/google';
import { prisma } from '../../lib/prisma';
import messages from '../messages/messages.controller';
import { tryCatch } from '../../lib/try-catch';
import { generateSessionName } from '../messages/messages.service';

const sessions = new Hono();

sessions.get('/', async (c) => {
  const { data: allSessions, error } = await tryCatch(
    prisma.session.findMany({
      select: {
        id: true,
        name: true,
        lastMessageAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        lastMessageAt: 'desc',
      },
    }),
  );

  if (error) {
    return c.json({ error: 'Failed to fetch sessions' }, 500);
  }

  return c.json(allSessions);
});

sessions.post('/', async (c) => {
  const { prompt, id } = await c.req.json<{ prompt?: string; id?: string }>();

  let name = 'New conversation';
  if (prompt) {
    const { data: nameResult, error: nameError } = await tryCatch(
      generateSessionName(prompt, google('gemini-2.0-flash')),
    );
    if (!nameError && nameResult) {
      name = nameResult;
    }
  }

  const { data: session, error } = await tryCatch(
    prisma.session.create({
      data: {
        id,
        name,
        messages: prompt
          ? {
              create: {
                role: 'user',
                content: prompt,
              },
            }
          : undefined,
      },
      include: {
        messages: true,
      },
    }),
  );

  if (error || !session) {
    return c.json({ error: 'Failed to create session' }, 500);
  }

  return c.json(session);
});

sessions.route('/:id/messages', messages);

export default sessions;
