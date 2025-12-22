import { Hono } from 'hono';
import { CoreMessage } from 'ai';
import { google } from '@ai-sdk/google';
import { prisma } from '../../lib/prisma';
import { ask, generateSessionName } from './messages.service';

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

messages.post('/', async (c) => {
  const sessionId = c.req.param('id');
  const { prompt } = await c.req.json<{ prompt: string }>();

  if (!prompt) {
    return c.json({ error: 'Prompt is required' }, 400);
  }

  let session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { _count: { select: { messages: true } } },
  });

  if (!session) {
    session = await prisma.session.create({
      data: {
        id: sessionId,
        userId: 'user_1',
        name: 'New conversation',
      },
      include: { _count: { select: { messages: true } } },
    });
  }

  await prisma.message.create({
    data: {
      role: 'user',
      content: prompt,
      sessionId,
    },
  });

  await prisma.session.update({
    where: { id: sessionId },
    data: { lastMessageAt: new Date() },
  });

  if (session._count.messages === 0 || session.name === 'New conversation') {
    const newName = await generateSessionName(
      prompt,
      google('gemini-2.0-flash'),
    );
    await prisma.session.update({
      where: { id: sessionId },
      data: { name: newName },
    });
  }

  const pastMessages = await prisma.message.findMany({
    where: { sessionId },
    select: {
      role: true,
      content: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
    take: 20,
  });

  const coreMessages: CoreMessage[] = pastMessages.map((m) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }));

  const answer = await ask(coreMessages, google('gemini-2.0-flash'));

  const llmAnswer = await prisma.message.create({
    data: {
      role: 'assistant',
      content: answer,
      sessionId,
    },
  });

  await prisma.session.update({
    where: { id: sessionId },
    data: { lastMessageAt: new Date() },
  });

  return c.json(llmAnswer);
});

export default messages;
