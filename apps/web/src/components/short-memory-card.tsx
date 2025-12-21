import type { MemoryEntry } from "@/types"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

import { EmptyState } from "@/components/empty-state"

interface ShortMemoryCardProps {
  entries: MemoryEntry[];
}

export function ShortMemoryCard({ entries }: ShortMemoryCardProps) {
  return (
    <Card className="flex h-1/2 flex-col rounded-none border-0 border-b">
      <CardHeader className="py-3">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Short-Term Memory (Session)
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto px-4 pb-4">
        {entries.length === 0 ? (
          <EmptyState message="No session context" />
        ) : (
          <div className="space-y-2">
            {entries.map((entry) => (
              <div key={entry.id} className="rounded-lg border bg-muted/50 p-2 text-xs">
                <div className="mb-1 font-medium text-primary">{entry.key}</div>
                <div className="text-muted-foreground">{entry.value}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
