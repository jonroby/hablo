"use client";

import { useState } from "react";
import { HighlightedText } from "@/components/chat/highlighted-text";
import { MessageControls } from "@/components/chat/message-controls";
import { TenseInfoSheet } from "@/components/chat/tense-info-sheet";
import { useVerbHighlight } from "@/components/chat/use-verb-highlight";
import { cn } from "@/lib/utils";
import type { TenseName } from "@/lib/prompts";
import type { ChatMessage } from "@/lib/types";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const { verbs, isLoading, active, toggle } = useVerbHighlight(
    message.content,
  );
  const [openTense, setOpenTense] = useState<TenseName | null>(null);

  return (
    <div className={cn("flex flex-col", isUser ? "items-end" : "items-start")}>
      <div className="flex max-w-[80%] flex-col gap-1">
        <div className="flex justify-end">
          <MessageControls
            text={message.content}
            translation={message.translation}
            verbsActive={active}
            verbsLoading={isLoading}
            onToggleVerbs={toggle}
          />
        </div>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
            isUser
              ? "rounded-br-md bg-primary text-primary-foreground"
              : "rounded-bl-md bg-muted text-foreground",
          )}
        >
          {verbs ? (
            <HighlightedText
              text={message.content}
              verbs={verbs}
              onTenseClick={setOpenTense}
            />
          ) : (
            message.content
          )}
        </div>
      </div>
      <TenseInfoSheet
        tense={openTense}
        onOpenChange={(open) => {
          if (!open) setOpenTense(null);
        }}
      />
    </div>
  );
}
