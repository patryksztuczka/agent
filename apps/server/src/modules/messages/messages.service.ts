import { generateText, LanguageModel, ModelMessage, streamText } from 'ai';

export async function generateMessageStream(
  messages: ModelMessage[],
  model: LanguageModel,
  systemPrompt?: string,
) {
  const stream = streamText({
    model,
    system:
      systemPrompt ||
      "You are a personal assistant. You trying to answer user's questions, based on your knowledge and provided conversation history.",
    messages,
  });

  return stream;
}

export async function generateSessionName(
  userPrompt: string,
  model: LanguageModel,
) {
  const { text } = await generateText({
    model,
    system:
      "You are a helpful assistant that generates short, concise titles for chat conversations. Generate a title (max 5 words) based on the user's first message. Do not use quotes or special characters.",
    prompt: `Generate a title for a conversation starting with: "${userPrompt}"`,
  });

  return text.trim();
}

export async function summarizeConversation(
  model: LanguageModel,
  previousSummary: string | null,
  newMessages: ModelMessage[],
) {
  const messagesContext = newMessages
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join('\n');

  const prompt = previousSummary
    ? `Current summary of the conversation:\n${previousSummary}\n\nNew messages to add to the summary:\n${messagesContext}\n\nPlease provide a new, concise, updated summary of the entire conversation so far in Markdown format. Focus on key information and context needed for the assistant to continue the conversation effectively.`
    : `Messages to summarize:\n${messagesContext}\n\nPlease provide a concise summary of the conversation so far in Markdown format. Focus on key information and context needed for the assistant to continue the conversation effectively.`;

  const { text } = await generateText({
    model,
    system:
      'You are an expert at summarizing conversations. Your goal is to create a concise, informative, and cohesive summary that captures all important context from a dialogue. Use Markdown for the summary.',
    prompt,
  });

  return text.trim();
}
