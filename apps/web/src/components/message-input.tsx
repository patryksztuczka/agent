import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchAgents } from "@/data-access-layer/agents";

interface MessageInputProps {
  onSend?: (content: string) => void;
  selectedAgentId?: number;
  onAgentSelect?: (id: number) => void;
}

export function MessageInput({
  onSend,
  selectedAgentId,
  onAgentSelect,
}: MessageInputProps) {
  const [value, setValue] = React.useState("");

  const { data: agents = [] } = useQuery({
    queryKey: ["agents"],
    queryFn: fetchAgents,
  });

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
    <div className="border-t p-4 bg-background space-y-3">
      <div className="flex items-center gap-2">
        <Select
          value={selectedAgentId?.toString()}
          onValueChange={(val) => onAgentSelect?.(parseInt(val))}
        >
          <SelectTrigger className="w-[200px]" size="sm">
            <SelectValue placeholder="Select an agent" />
          </SelectTrigger>
          <SelectContent>
            {agents.map((agent) => (
              <SelectItem key={agent.id} value={agent.id.toString()}>
                {agent.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
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
