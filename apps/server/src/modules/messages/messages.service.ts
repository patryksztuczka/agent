import { generateText, LanguageModel, ModelMessage, streamText } from 'ai';

export async function generateMessageStream(
  messages: ModelMessage[],
  model: LanguageModel,
) {
  const stream = streamText({
    model,
    system:
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
