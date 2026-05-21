"use client";

import { Plus, MessageSquare, Trash2, PanelLeftClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/lib/types";

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function Sidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  onClose,
}: SidebarProps) {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r bg-muted/30">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-lg font-semibold tracking-tight">Hablo</span>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Cerrar barra lateral"
        >
          <PanelLeftClose className="size-5" />
        </button>
      </div>

      <div className="px-3 pb-2">
        <Button onClick={onNew} className="w-full justify-start gap-2" variant="outline">
          <Plus className="size-4" />
          Nueva conversación
        </Button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-2 pb-3">
        {conversations.length === 0 ? (
          <p className="px-3 py-2 text-xs text-muted-foreground">
            No hay conversaciones todavía.
          </p>
        ) : (
          conversations.map((c) => (
            <div
              key={c.id}
              className={cn(
                "group flex items-center gap-2 rounded-md px-3 py-2 text-sm",
                c.id === activeId
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/50",
              )}
            >
              <button
                onClick={() => onSelect(c.id)}
                className="flex min-w-0 flex-1 items-center gap-2 text-left"
              >
                <MessageSquare className="size-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{c.title}</span>
              </button>
              <button
                onClick={() => onDelete(c.id)}
                className="shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                aria-label="Eliminar conversación"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))
        )}
      </nav>
    </aside>
  );
}
