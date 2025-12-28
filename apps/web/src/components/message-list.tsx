import { useQuery } from "@tanstack/react-query";
import { fetchMessages } from "@/data-access-layer/messages";
import { MessageItem } from "@/components/message-item";
import { EmptyState } from "@/components/empty-state";

interface MessageListProps {
  sessionId: string | undefined;
  streamingMessage?: string;
}

export function MessageList({
  sessionId,
  streamingMessage,
}: MessageListProps) {
  const { data: messages = [] } = useQuery({
    queryKey: ["messages", sessionId],
    queryFn: () => fetchMessages(sessionId!),
    enabled: !!sessionId,
  });

  if (!sessionId || (messages.length === 0 && !streamingMessage)) {
    return <EmptyState message="Start a conversation with your assistant" />;
  }

  return (
    <div className="flex flex-col">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
      {streamingMessage && (
        <MessageItem
          message={{
            id: "streaming",
            role: "assistant",
            content: streamingMessage,
            createdAt: new Date(),
            sessionId: "streaming",
          }}
        />
      )}
    </div>
  );
}
