"use client";

import { useEffect, useState } from "react";
import { PanelLeftOpen } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { ChatPanel } from "@/components/chat-panel";
import {
  createConversation,
  loadConversations,
  saveConversations,
} from "@/lib/storage";
import type { ChatMessage, Conversation } from "@/lib/types";

function deriveTitle(messages: ChatMessage[]): string {
  const firstUser = messages.find((m) => m.role === "user");
  if (!firstUser) return "Nueva conversación";
  return firstUser.content.slice(0, 40);
}

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Hydrate from localStorage after mount, then keep it in sync. localStorage
  // is client-only, so this can't happen during render. The first run loads
  // stored conversations (or seeds one); later runs persist changes.
  useEffect(() => {
    if (!hydrated) {
      const stored = loadConversations();
      const initial = stored.length > 0 ? stored : [createConversation()];
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is client-only; one-time hydration must run post-mount
      setConversations(initial);
      setActiveId(initial[0].id);
      setHydrated(true);
      return;
    }
    saveConversations(conversations);
  }, [conversations, hydrated]);

  function handleNew() {
    const conversation = createConversation();
    setConversations((prev) => [conversation, ...prev]);
    setActiveId(conversation.id);
  }

  function handleDelete(id: string) {
    setConversations((prev) => {
      const next = prev.filter((c) => c.id !== id);
      if (id === activeId) {
        setActiveId(next[0]?.id ?? null);
      }
      return next;
    });
  }

  function handleMessagesChange(
    updater: (prev: ChatMessage[]) => ChatMessage[],
  ) {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== activeId) return c;
        const messages = updater(c.messages);
        return { ...c, messages, title: deriveTitle(messages) };
      }),
    );
  }

  const active = conversations.find((c) => c.id === activeId) ?? null;

  return (
    <div className="flex flex-1 overflow-hidden">
      {sidebarOpen && (
        <Sidebar
          conversations={conversations}
          activeId={activeId}
          onSelect={setActiveId}
          onNew={handleNew}
          onDelete={handleDelete}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      <div className="relative flex flex-1 flex-col overflow-hidden">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute left-3 top-3 z-10 text-muted-foreground hover:text-foreground"
            aria-label="Abrir barra lateral"
          >
            <PanelLeftOpen className="size-5" />
          </button>
        )}

        {active ? (
          <ChatPanel
            key={active.id}
            messages={active.messages}
            onMessagesChange={handleMessagesChange}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
            Crea una conversación para empezar.
          </div>
        )}
      </div>
    </div>
  );
}
