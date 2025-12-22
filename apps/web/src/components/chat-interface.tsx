import type { Message } from "@/schemas/messages"
import { MessageList } from "@/components/message-list"
import { MessageInput } from "@/components/message-input"

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage?: (content: string) => void;
  isLoading?: boolean;
}

export function ChatInterface({ messages, onSendMessage, isLoading }: ChatInterfaceProps) {
  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Loading messages...
          </div>
        ) : (
          <MessageList messages={messages} />
        )}
      </div>
      <MessageInput onSend={onSendMessage} />
    </div>
  )
}
