import type { Session } from "@/schemas/sessions"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/empty-state"
import { MessageCirclePlus, Plus } from "lucide-react"

interface SessionSidebarProps {
  sessions: Session[];
  activeSessionId?: string;
  isLoading?: boolean;
  onSessionSelect?: (id: string) => void;
  onNewSession?: () => void;
}

export function SessionSidebar({ 
  sessions, 
  activeSessionId, 
  isLoading,
  onSessionSelect,
  onNewSession
}: SessionSidebarProps) {
  return (
    <aside className="flex h-full w-64 flex-col border-r bg-muted/30">
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Sessions</h2>
        <Button size="icon-xs" variant="ghost" onClick={onNewSession}>
          <Plus className="size-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
            Loading...
          </div>
        ) : (
          <div className="space-y-1">
            {sessions.length > 0 && sessions.map((session) => (
              <Button
                key={session.id}
                variant={activeSessionId === session.id ? "secondary" : "ghost"}
                className="w-full justify-start text-left"
                onClick={() => onSessionSelect?.(session.id)}
              >
                 <MessageCirclePlus className="mr-2 size-4" />
                <span className="truncate">{session.name}</span>
              </Button>
            ))}
            {sessions.length === 0 && !isLoading && (
              <EmptyState message="No sessions yet" />
            )}
          </div>
        )}
      </div>
    </aside>
  )
}
