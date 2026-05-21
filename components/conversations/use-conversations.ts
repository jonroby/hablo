"use client";

import { useCallback, useEffect, useState } from "react";
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

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

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

  const newConversation = useCallback(() => {
    const conversation = createConversation();
    setConversations((prev) => [conversation, ...prev]);
    setActiveId(conversation.id);
  }, []);

  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => {
        const next = prev.filter((c) => c.id !== id);
        if (id === activeId) setActiveId(next[0]?.id ?? null);
        return next;
      });
    },
    [activeId],
  );

  const updateActiveMessages = useCallback(
    (updater: (prev: ChatMessage[]) => ChatMessage[]) => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== activeId) return c;
          const messages = updater(c.messages);
          return { ...c, messages, title: deriveTitle(messages) };
        }),
      );
    },
    [activeId],
  );

  const active = conversations.find((c) => c.id === activeId) ?? null;

  return {
    conversations,
    activeId,
    active,
    selectConversation: setActiveId,
    newConversation,
    deleteConversation,
    updateActiveMessages,
  };
}
