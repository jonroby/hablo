"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || disabled) return;
    onSend(text);
    setInput("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 border-t px-6 py-4">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Escribe en inglés o español…"
        className="flex-1"
        autoFocus
        disabled={disabled}
      />
      <Button type="submit" size="icon" disabled={!input.trim() || disabled}>
        <Send className="size-4" />
        <span className="sr-only">Enviar</span>
      </Button>
    </form>
  );
}
