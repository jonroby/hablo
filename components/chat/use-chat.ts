"use client";

import { useCallback, useState } from "react";
import { sendChat } from "@/lib/api";
import type { ChatMessage } from "@/lib/types";

interface UseChatArgs {
  messages: ChatMessage[];
  onMessagesChange: (updater: (prev: ChatMessage[]) => ChatMessage[]) => void;
}

export function useChat({ messages, onMessagesChange }: UseChatArgs) {
  const [isLoading, setIsLoading] = useState(false);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const userId = crypto.randomUUID();
      const history = messages.map(({ role, content }) => ({ role, content }));

      onMessagesChange((prev) => [
        ...prev,
        { id: userId, role: "user", content: trimmed },
      ]);
      setIsLoading(true);

      try {
        const { translation, reply, replyTranslation } = await sendChat({
          messages: [...history, { role: "user", content: trimmed }],
        });

        onMessagesChange((prev) => [
          // Show the corrected Spanish, but keep the original input so the
          // translation toggle can reveal what the user actually typed.
          ...prev.map((m) =>
            m.id === userId
              ? { ...m, content: translation, translation: trimmed }
              : m,
          ),
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: reply,
            translation: replyTranslation,
          },
        ]);
      } catch {
        onMessagesChange((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "Lo siento, algo salió mal. Inténtalo de nuevo.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, onMessagesChange, isLoading],
  );

  return { isLoading, send };
}
