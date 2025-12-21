import type { Message } from "@/types"
import { MessageItem } from "@/components/message-item"
import { EmptyState } from "@/components/empty-state"

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) {
    return <EmptyState message="Start a conversation with your assistant" />
  }

  return (
    <div className="flex flex-col">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
    </div>
  )
}
