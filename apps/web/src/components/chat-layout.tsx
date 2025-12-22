import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SessionSidebar } from "@/components/session-sidebar";
import { ChatInterface } from "@/components/chat-interface";
import { MemoryPanel } from "@/components/memory-panel";
import { fetchSessions } from "@/data-access-layer/sessions";
import { fetchMessages, sendMessage } from "@/data-access-layer/messages";
import type { MemoryEntry } from "@/types";

const MOCK_SHORT_MEMORY: MemoryEntry[] = [
  { id: "s1", key: "current_topic", value: "Project deadlines" },
  { id: "s2", key: "user_mood", value: "Productive" },
];

const MOCK_LONG_MEMORY: MemoryEntry[] = [
  { id: "l1", key: "user_name", value: "John Doe", category: "personal" },
  {
    id: "l2",
    key: "preferred_framework",
    value: "React/Next.js",
    category: "tech",
  },
  { id: "l3", key: "birthday", value: "March 15th", category: "personal" },
];

export function ChatLayout() {
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>();
  const queryClient = useQueryClient();

  const { data: sessions = [], isLoading: isSessionsLoading } = useQuery({
    queryKey: ["sessions"],
    queryFn: fetchSessions,
  });

  useEffect(() => {
    if (!isSessionsLoading && !activeSessionId) {
      if (sessions.length > 0) {
        setActiveSessionId(sessions[0].id);
      } else {
        setActiveSessionId(crypto.randomUUID());
      }
    }
  }, [sessions, activeSessionId, isSessionsLoading]);

  const { data: messages = [], isLoading: isMessagesLoading } = useQuery({
    queryKey: ["messages", activeSessionId],
    queryFn: () => fetchMessages(activeSessionId!),
    enabled: !!activeSessionId,
  });

  const mutation = useMutation({
    mutationFn: ({
      sessionId,
      prompt,
    }: {
      sessionId: string;
      prompt: string;
    }) => sendMessage(sessionId, prompt),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", activeSessionId],
      });
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });

  const handleSendMessage = (content: string) => {
    if (!activeSessionId) return;
    mutation.mutate({ sessionId: activeSessionId, prompt: content });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <SessionSidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        isLoading={isSessionsLoading}
        onSessionSelect={(id) => setActiveSessionId(id)}
        onNewSession={() => setActiveSessionId(crypto.randomUUID())}
      />
      <main className="flex flex-1 flex-col overflow-hidden">
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isMessagesLoading || mutation.isPending}
        />
      </main>
      <MemoryPanel shortTerm={MOCK_SHORT_MEMORY} longTerm={MOCK_LONG_MEMORY} />
    </div>
  );
}
