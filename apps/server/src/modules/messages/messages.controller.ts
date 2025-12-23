import { Hono } from 'hono';
import { streamText } from 'hono/streaming';
import { ModelMessage } from 'ai';
import { google } from '@ai-sdk/google';
import { prisma } from '../../lib/prisma';
import { generateMessageStream, generateSessionName } from './messages.service';
import { tryCatch } from '../../lib/try-catch';

const messages = new Hono();

messages.get('/', async (c) => {
  const sessionId = c.req.param('id');

  const { data: session, error: sessionError } = await tryCatch(
    prisma.session.findUnique({
      where: { id: sessionId },
    }),
  );

  if (sessionError) {
    return c.json({ error: 'Internal server error' }, 500);
  }

  if (!session) {
    return c.json({ error: 'Session not found' }, 404);
  }

  const { data: allMessages, error: messagesError } = await tryCatch(
    prisma.message.findMany({
      where: { sessionId },
      orderBy: {
        createdAt: 'asc',
      },
    }),
  );

  if (messagesError) {
    return c.json({ error: 'Internal server error' }, 500);
  }

  return c.json(allMessages);
});

messages.post('/', async (c) => {
  const sessionId = c.req.param('id');
  const { prompt } = await c.req.json<{ prompt: string }>();

  if (!prompt) {
    return c.json({ error: 'Prompt is required' }, 400);
  }

  const { data: session, error: findSessionError } = await tryCatch(
    prisma.session.findUnique({
      where: { id: sessionId },
    }),
  );

  if (findSessionError) {
    return c.json({ error: 'Internal server error' }, 500);
  }

  if (!session) {
    const { data: nameResult } = await tryCatch(
      generateSessionName(prompt, google('gemini-2.0-flash')),
    );

    const { data: newSession, error: createSessionError } = await tryCatch(
      prisma.session.create({
        data: {
          id: sessionId,
          name: nameResult || 'New conversation',
        },
      }),
    );

    if (createSessionError || !newSession) {
      return c.json({ error: 'Failed to create session' }, 500);
    }
    session = newSession;
  }

  const { data: userMessage, error: createUserMessageError } = await tryCatch(
    prisma.message.create({
      data: {
        role: 'user',
        content: prompt,
        sessionId: session.id,
      },
    }),
  );

  if (createUserMessageError || !userMessage) {
    return c.json({ error: 'Failed to save user message' }, 500);
  }

  const { error: updateSessionError } = await tryCatch(
    prisma.session.update({
      where: { id: sessionId },
      data: { lastMessageAt: new Date() },
    }),
  );

  if (updateSessionError) {
    return c.json({ error: 'Failed to update session timestamp' }, 500);
  }

  return c.json(userMessage);
});

messages.post('/completion', async (c) => {
  const sessionId = c.req.param('id');

  const { data: session, error: findSessionError } = await tryCatch(
    prisma.session.findUnique({
      where: { id: sessionId },
    }),
  );

  if (findSessionError) {
    return c.json({ error: 'Internal server error' }, 500);
  }

  if (!session) {
    return c.json({ error: 'Session not found' }, 404);
  }

  const { data: pastMessages, error: findPastMessagesError } = await tryCatch(
    prisma.message.findMany({
      where: { sessionId },
      select: {
        role: true,
        content: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
      take: 20,
    }),
  );

  if (findPastMessagesError || !pastMessages) {
    return c.json({ error: 'Internal server error' }, 500);
  }

  const coreMessages: ModelMessage[] = pastMessages.map((m) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }));

  const result = await generateMessageStream(
    coreMessages,
    google('gemini-2.0-flash'),
  );

  return streamText(c, async (stream) => {
    let fullContent = '';
    for await (const textPart of result.textStream) {
      fullContent += textPart;
      stream.writeln(textPart);
    }

    const { error: createAssistantMessageError } = await tryCatch(
      prisma.message.create({
        data: {
          role: 'assistant',
          content: fullContent,
          sessionId: session.id,
        },
      }),
    );

    if (createAssistantMessageError) {
      console.error(
        'Failed to save assistant message:',
        createAssistantMessageError,
      );
    }

    const { error: updateSessionError } = await tryCatch(
      prisma.session.update({
        where: { id: sessionId },
        data: { lastMessageAt: new Date() },
      }),
    );

    if (updateSessionError) {
      console.error('Failed to update session timestamp', updateSessionError);
    }
  });
});

export default messages;
