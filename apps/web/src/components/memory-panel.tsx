import type { MemoryEntry } from "@/types"
import { ShortMemoryCard } from "@/components/short-memory-card"
import { LongMemoryCard } from "@/components/long-memory-card"

interface MemoryPanelProps {
  shortTerm: MemoryEntry[];
  longTerm: MemoryEntry[];
}

export function MemoryPanel({ shortTerm, longTerm }: MemoryPanelProps) {
  return (
    <aside className="flex h-full w-80 flex-col border-l bg-muted/10">
      <ShortMemoryCard entries={shortTerm} />
      <LongMemoryCard entries={longTerm} />
    </aside>
  )
}
