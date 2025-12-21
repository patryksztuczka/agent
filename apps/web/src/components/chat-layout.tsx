import { SessionSidebar } from "@/components/session-sidebar";
import { ChatInterface } from "@/components/chat-interface";
import { MemoryPanel } from "@/components/memory-panel";
import type { Message, Session, MemoryEntry } from "@/types";

const MOCK_SESSIONS: Session[] = [
  { id: "1", title: "Personal Assistant Ideas", lastMessageAt: new Date() },
  { id: "2", title: "Project Planning", lastMessageAt: new Date() },
  { id: "3", title: "Learning React", lastMessageAt: new Date() },
];

const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hello! I am your personal AI assistant. How can I help you today?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: "2",
    role: "user",
    content: "Can you help me remember my project deadlines?",
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
  },
  {
    id: "3",
    role: "assistant",
    content:
      "Of course! I'll keep track of them in my long-term memory. What are the dates?",
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
  },
];

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
  const handleSendMessage = (content: string) => {
    console.log("Sending message:", content);
    // In a real app, you would update the messages state here
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <SessionSidebar sessions={MOCK_SESSIONS} activeSessionId="1" />
      <main className="flex flex-1 flex-col overflow-hidden">
        <ChatInterface 
          messages={MOCK_MESSAGES} 
          onSendMessage={handleSendMessage}
        />
      </main>
      <MemoryPanel shortTerm={MOCK_SHORT_MEMORY} longTerm={MOCK_LONG_MEMORY} />
    </div>
  )
}
