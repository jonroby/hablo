"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageBubble } from "@/components/message-bubble";
import type { ChatMessage } from "@/lib/types";

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    const userId = crypto.randomUUID();
    // Show the original text immediately; it gets replaced by the Spanish
    // translation once the API responds.
    setMessages((prev) => [
      ...prev,
      { id: userId, role: "user", content: text },
    ]);
    setInput("");
    setIsLoading(true);

    // History sent to the API: prior turns are already in Spanish, plus the
    // new raw user text for this turn.
    const history = messages.map(({ role, content }) => ({
      id: crypto.randomUUID(),
      role,
      content,
    }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...history, { id: userId, role: "user", content: text }],
        }),
      });

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      const { translation, reply } = (await res.json()) as {
        translation: string;
        reply: string;
      };

      setMessages((prev) => [
        ...prev.map((m) =>
          m.id === userId ? { ...m, content: translation } : m,
        ),
        { id: crypto.randomUUID(), role: "assistant", content: reply },
      ]);
    } catch {
      setMessages((prev) => [
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
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col">
      <header className="border-b px-6 py-4">
        <h1 className="text-lg font-semibold tracking-tight">Hablo</h1>
        <p className="text-sm text-muted-foreground">
          Escribe en cualquier idioma — lo traducimos al español
        </p>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
        {messages.length === 0 ? (
          <p className="pt-12 text-center text-sm text-muted-foreground">
            Escribe un mensaje para empezar.
          </p>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2 border-t px-6 py-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe en inglés o español…"
          className="flex-1"
          autoFocus
          disabled={isLoading}
        />
        <Button type="submit" size="icon" disabled={!input.trim() || isLoading}>
          <Send className="size-4" />
          <span className="sr-only">Enviar</span>
        </Button>
      </form>
    </main>
  );
}
