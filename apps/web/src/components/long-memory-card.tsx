import type { MemoryEntry } from "@/types"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { EmptyState } from "@/components/empty-state"

interface LongMemoryCardProps {
  entries: MemoryEntry[];
  isLoading?: boolean;
}

export function LongMemoryCard({ entries, isLoading }: LongMemoryCardProps) {
  return (
    <Card className="flex h-1/2 flex-col rounded-none border-0">
      <CardHeader className="py-3">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Long-Term Memory (Persistent)
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto px-4 pb-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
            Loading summary...
          </div>
        ) : entries.length === 0 ? (
          <EmptyState message="No persistent memories" />
        ) : (
          <div className="space-y-2">
            {entries.map((entry) => (
              <div key={entry.id} className="rounded-lg border bg-muted/50 p-2 text-xs">
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-medium text-primary">{entry.key}</span>
                  {entry.category && (
                    <span className="text-[10px] text-muted-foreground bg-muted px-1 rounded">
                      {entry.category}
                    </span>
                  )}
                </div>
                <div className="text-muted-foreground whitespace-pre-wrap">{entry.value}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
