import type { Message } from "@/types"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === 'user';
  
  return (
    <div className={cn(
      "flex w-full flex-col gap-2 p-4",
      isUser ? "items-end" : "items-start"
    )}>
      <div className="flex items-center gap-2">
        <Badge variant={isUser ? "default" : "secondary"}>
          {isUser ? "You" : "Assistant"}
        </Badge>
        <span className="text-[10px] text-muted-foreground">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
      <div className={cn(
        "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
        isUser 
          ? "bg-primary text-primary-foreground rounded-tr-none" 
          : "bg-muted text-foreground rounded-tl-none border"
      )}>
        {message.content}
      </div>
    </div>
  )
}
