import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface MessageInputProps {
  onSend?: (content: string) => void;
}

export function MessageInput({ onSend }: MessageInputProps) {
  const [value, setValue] = React.useState("");

  const handleSend = () => {
    if (value.trim()) {
      onSend?.(value.trim());
      setValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t p-4 bg-background">
      <div className="relative flex items-end gap-2">
        <Textarea
          placeholder="Type your message..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-15 resize-none pr-12"
        />
        <Button
          size="icon-sm"
          className="absolute right-2 bottom-2"
          disabled={!value.trim()}
          onClick={handleSend}
        >
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
}
