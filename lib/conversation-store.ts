import type { Conversation } from "@/lib/types";

const STORAGE_KEY = "hablo.conversations";

export function createConversation(): Conversation {
  return {
    id: crypto.randomUUID(),
    title: "Nueva conversación",
    messages: [],
    createdAt: Date.now(),
  };
}

function read(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Conversation[]) : [];
  } catch {
    return [];
  }
}

// In-memory cache. useSyncExternalStore requires getSnapshot to return a
// stable reference unless the data actually changed, so we hold the current
// array here and only replace it on mutation.
let cache: Conversation[] | null = null;
const listeners = new Set<() => void>();
const SERVER_SNAPSHOT: Conversation[] = [];

function current(): Conversation[] {
  if (cache === null) {
    const stored = read();
    cache = stored.length > 0 ? stored : [createConversation()];
  }
  return cache;
}

export const conversationStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot(): Conversation[] {
    return current();
  },
  getServerSnapshot(): Conversation[] {
    return SERVER_SNAPSHOT;
  },
  set(updater: (prev: Conversation[]) => Conversation[]) {
    const next = updater(current());
    cache = next;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
    listeners.forEach((l) => l());
  },
};
