import { useQuery } from "@tanstack/react-query";
import { fetchSessionContext } from "@/data-access-layer/memory";
import { ShortMemoryCard } from "@/components/short-memory-card"
import { LongMemoryCard } from "@/components/long-memory-card"
import type { MemoryEntry } from "@/types"

interface MemoryPanelProps {
  sessionId: string | undefined;
}

export function MemoryPanel({ sessionId }: MemoryPanelProps) {
  const { data: context, isLoading } = useQuery({
    queryKey: ["context", sessionId],
    queryFn: () => fetchSessionContext(sessionId!),
    enabled: !!sessionId,
  });

  if (!sessionId) {
    return (
      <aside className="flex h-full w-80 flex-col border-l bg-muted/10">
        <ShortMemoryCard entries={[]} />
        <LongMemoryCard entries={[]} />
      </aside>
    );
  }

  const shortTerm: MemoryEntry[] = [];

  if (context?.summary) {
    shortTerm.push({
      id: "latest-summary",
      key: `Summary (up to ${context.summary.count} msgs)`,
      value: context.summary.content,
    });
  }

  if (context?.messages) {
    shortTerm.push(...context.messages.map((m) => ({
      id: m.id,
      key: m.role === "user" ? "User" : "Assistant",
      value: m.content,
    })));
  }

  return (
    <aside className="flex h-full w-80 flex-col border-l bg-muted/10">
      <ShortMemoryCard entries={shortTerm} isLoading={isLoading} />
      <LongMemoryCard entries={[]} isLoading={isLoading} />
    </aside>
  )
}
