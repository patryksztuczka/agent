import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { SessionSidebar } from "@/components/session-sidebar";
import { ChatInterface } from "@/components/chat-interface";
import { MemoryPanel } from "@/components/memory-panel";
import { createSession } from "@/data-access-layer/sessions";
import { fetchMessages, saveMessage, getCompletion } from "@/data-access-layer/messages";
import type { Session } from "@/schemas/sessions";
import type { Message } from "@/schemas/messages";

export function ChatLayout() {
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>();
  const [streamingMessage, setStreamingMessage] = useState<string>("");
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading: isMessagesLoading } = useQuery({
    queryKey: ["messages", activeSessionId],
    queryFn: () => fetchMessages(activeSessionId!),
    enabled: !!activeSessionId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: ({
      sessionId,
      content,
    }: {
      sessionId: string;
      content: string;
    }) => saveMessage(sessionId, content),
    onMutate: async ({ sessionId, content }) => {
      await queryClient.cancelQueries({ queryKey: ["messages", sessionId] });
      const previousMessages = queryClient.getQueryData<Message[]>([
        "messages",
        sessionId,
      ]);

      queryClient.setQueryData<Message[]>(["messages", sessionId], (old) => [
        ...(old || []),
        {
          id: uuidv4(),
          content,
          role: "user",
          sessionId,
          createdAt: new Date(),
        },
      ]);

      return { previousMessages };
    },
    onError: (_err, { sessionId }, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          ["messages", sessionId],
          context.previousMessages,
        );
      }
    },
    onSettled: (_data, _error, { sessionId }) => {
      queryClient.invalidateQueries({ queryKey: ["messages", sessionId] });
    },
  });

  const createSessionMutation = useMutation({
    mutationKey: ["session"],
    mutationFn: ({ prompt, id }: { prompt: string; id: string }) =>
      createSession(prompt, id),
    onMutate: async ({ prompt, id }) => {
      await queryClient.cancelQueries({ queryKey: ["sessions"] });
      await queryClient.cancelQueries({ queryKey: ["messages", id] });
      const previousSessions = queryClient.getQueryData<Session[]>([
        "sessions",
      ]);

      const newSession: Session = {
        id,
        name: "New conversation...",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastMessageAt: new Date(),
      };

      queryClient.setQueryData<Session[]>(["sessions"], (old) => [
        newSession,
        ...(old || []),
      ]);

      // Also set optimistic message for the new session
      queryClient.setQueryData<Message[]>(["messages", id], [
        {
          id: uuidv4(),
          content: prompt,
          role: "user",
          sessionId: id,
          createdAt: new Date(),
        },
      ]);

      return { previousSessions };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousSessions) {
        queryClient.setQueryData(["sessions"], context.previousSessions);
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["messages", variables.id] });
    },
  });

  const handleSendMessage = async (content: string) => {
    let sessionId = activeSessionId;

    if (!sessionId) {
      const newSessionId = uuidv4();
      
      // Optimistically set the message data before triggering any state updates
      queryClient.setQueryData<Message[]>(["messages", newSessionId], [
        {
          id: uuidv4(),
          content,
          role: "user",
          sessionId: newSessionId,
          createdAt: new Date(),
        },
      ]);

      setActiveSessionId(newSessionId);
      
      const session = await createSessionMutation.mutateAsync({
        prompt: content,
        id: newSessionId,
      });
      sessionId = session.id;
    } else {
      await sendMessageMutation.mutateAsync({ sessionId, content });
    }

    setStreamingMessage("");
    try {
      const stream = getCompletion(sessionId);
      let fullContent = "";
      for await (const chunk of stream) {
        fullContent += chunk;
        setStreamingMessage(fullContent);
      }
      setStreamingMessage("");
      queryClient.invalidateQueries({ queryKey: ["messages", sessionId] });
    } catch (error) {
      console.error("Completion error:", error);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <SessionSidebar
        activeSessionId={activeSessionId}
        onSessionSelect={(id) => setActiveSessionId(id)}
        onNewSession={() => setActiveSessionId(undefined)}
      />
      <main className="flex flex-1 flex-col overflow-hidden">
        <ChatInterface
          sessionId={activeSessionId}
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isMessagesLoading}
          streamingMessage={streamingMessage}
        />
      </main>
      <MemoryPanel shortTerm={[]} longTerm={[]} />
    </div>
  );
}
