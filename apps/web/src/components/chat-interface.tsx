import { useEffect, useRef } from "react";
import type { Message } from "@/schemas/messages";
import { MessageList } from "@/components/message-list";
import { MessageInput } from "@/components/message-input";

interface ChatInterfaceProps {
  sessionId: string | undefined;
  messages: Message[];
  onSendMessage?: (content: string) => void;
  isLoading?: boolean;
  streamingMessage?: string;
}

export function ChatInterface({
  sessionId,
  messages,
  onSendMessage,
  isLoading,
  streamingMessage,
}: ChatInterfaceProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

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
              messages={messages}
              streamingMessage={streamingMessage}
            />
          )}
        </div>
      </div>
      <MessageInput onSend={onSendMessage} />
    </div>
  );
}
