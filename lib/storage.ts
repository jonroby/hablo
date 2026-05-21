import type { Conversation } from "@/lib/types";

const STORAGE_KEY = "hablo.conversations";

export function loadConversations(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Conversation[];
  } catch {
    return [];
  }
}

export function saveConversations(conversations: Conversation[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
}

export function createConversation(): Conversation {
  return {
    id: crypto.randomUUID(),
    title: "Nueva conversación",
    messages: [],
    createdAt: Date.now(),
  };
}
