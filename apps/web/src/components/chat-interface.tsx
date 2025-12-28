import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMessages } from "@/data-access-layer/messages";
import { MessageList } from "@/components/message-list";
import { MessageInput } from "@/components/message-input";

interface ChatInterfaceProps {
  sessionId: string | undefined;
  onSendMessage?: (content: string) => void;
  streamingMessage?: string;
  selectedAgentId?: number;
  onAgentSelect?: (id: number) => void;
}

export function ChatInterface({
  sessionId,
  onSendMessage,
  streamingMessage,
  selectedAgentId,
  onAgentSelect,
}: ChatInterfaceProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["messages", sessionId],
    queryFn: () => fetchMessages(sessionId!),
    enabled: !!sessionId,
  });

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="flex min-h-full flex-col justify-end">
          {isLoading && messages.length === 0 ? (
            <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
              Loading messages...
            </div>
          ) : (
            <MessageList
              sessionId={sessionId}
              streamingMessage={streamingMessage}
            />
          )}
        </div>
      </div>
      <MessageInput
        onSend={onSendMessage}
        selectedAgentId={selectedAgentId}
        onAgentSelect={onAgentSelect}
      />
    </div>
  );
}
