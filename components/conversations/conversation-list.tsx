"use client";

import { ConversationItem } from "@/components/conversations/conversation-item";
import type { Conversation } from "@/lib/types";

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ConversationList({
  conversations,
  activeId,
  onSelect,
  onDelete,
}: ConversationListProps) {
  return (
    <nav className="flex-1 space-y-1 overflow-y-auto px-2 pb-3">
      {conversations.length === 0 ? (
        <p className="px-3 py-2 text-xs text-muted-foreground">
          No hay conversaciones todavía.
        </p>
      ) : (
        conversations.map((c) => (
          <ConversationItem
            key={c.id}
            conversation={c}
            isActive={c.id === activeId}
            onSelect={onSelect}
            onDelete={onDelete}
          />
        ))
      )}
    </nav>
  );
}
