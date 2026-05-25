"use client";

import { useState } from "react";
import { HighlightedText } from "@/components/chat/highlighted-text";
import { MessageControls } from "@/components/chat/message-controls";
import { TenseInfoSheet } from "@/components/chat/tense-info-sheet";
import { useHighlight } from "@/components/chat/use-highlight";
import type { InfoRequest } from "@/components/chat/rules";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/types";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const { spans, isLoading, active, toggle } = useHighlight(message.content);
  const [info, setInfo] = useState<InfoRequest | null>(null);

  return (
    <div className={cn("flex flex-col", isUser ? "items-end" : "items-start")}>
      <div className="flex max-w-[80%] flex-col gap-1">
        <div className="flex justify-end">
          <MessageControls
            text={message.content}
            translation={message.translation}
            highlightActive={active}
            highlightLoading={isLoading}
            onToggleHighlight={toggle}
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
          {spans ? (
            <HighlightedText
              text={message.content}
              spans={spans}
              onShowInfo={setInfo}
            />
          ) : (
            message.content
          )}
        </div>
      </div>
      <TenseInfoSheet
        tense={info?.kind === "tense" ? info.tense : null}
        onOpenChange={(open) => {
          if (!open) setInfo(null);
        }}
      />
    </div>
  );
}
