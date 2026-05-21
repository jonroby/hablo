"use client";

import { MessageSquare, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/lib/types";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ConversationItem({
  conversation,
  isActive,
  onSelect,
  onDelete,
}: ConversationItemProps) {
  return (
    <div
      className={cn(
        "group flex items-center gap-2 rounded-md px-3 py-2 text-sm",
        isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/50",
      )}
    >
      <button
        onClick={() => onSelect(conversation.id)}
        className="flex min-w-0 flex-1 items-center gap-2 text-left"
      >
        <MessageSquare className="size-4 shrink-0 text-muted-foreground" />
        <span className="truncate">{conversation.title}</span>
      </button>
      <button
        onClick={() => onDelete(conversation.id)}
        className="shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
        aria-label="Eliminar conversación"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}
