"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { conversationStore, createConversation } from "@/lib/conversation-store";
import type { ChatMessage } from "@/lib/types";

function deriveTitle(messages: ChatMessage[]): string {
  const firstUser = messages.find((m) => m.role === "user");
  if (!firstUser) return "Nueva conversación";
  return firstUser.content.slice(0, 40);
}

export function useConversations() {
  // Conversations are persisted in localStorage and exposed through an
  // external store. useSyncExternalStore renders the empty server snapshot
  // during SSR and the real client snapshot after — no hydration mismatch,
  // no effects.
  const conversations = useSyncExternalStore(
    conversationStore.subscribe,
    conversationStore.getSnapshot,
    conversationStore.getServerSnapshot,
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Selection is UI state; if nothing is selected yet, default to the first.
  const activeId = selectedId ?? conversations[0]?.id ?? null;

  const newConversation = useCallback(() => {
    const conversation = createConversation();
    conversationStore.set((prev) => [conversation, ...prev]);
    setSelectedId(conversation.id);
  }, []);

  const deleteConversation = useCallback((id: string) => {
    conversationStore.set((prev) => prev.filter((c) => c.id !== id));
    setSelectedId((current) =>
      current === id ? (conversationStore.getSnapshot()[0]?.id ?? null) : current,
    );
  }, []);

  const updateActiveMessages = useCallback(
    (updater: (prev: ChatMessage[]) => ChatMessage[]) => {
      conversationStore.set((prev) =>
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
    selectConversation: setSelectedId,
    newConversation,
    deleteConversation,
    updateActiveMessages,
  };
}
