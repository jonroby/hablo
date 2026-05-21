"use client";

import { Plus, PanelLeftClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConversationList } from "@/components/conversations/conversation-list";
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

      <ConversationList
        conversations={conversations}
        activeId={activeId}
        onSelect={onSelect}
        onDelete={onDelete}
      />
    </aside>
  );
}
