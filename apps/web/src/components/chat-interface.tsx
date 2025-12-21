import type { Message } from "@/types"
import { MessageList } from "@/components/message-list"
import { MessageInput } from "@/components/message-input"

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage?: (content: string) => void;
}

export function ChatInterface({ messages, onSendMessage }: ChatInterfaceProps) {
  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <MessageList messages={messages} />
      </div>
      <MessageInput onSend={onSendMessage} />
    </div>
  )
}
