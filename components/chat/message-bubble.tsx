"use client";

import { HighlightedText } from "@/components/chat/highlighted-text";
import { MessageControls } from "@/components/chat/message-controls";
import { useVerbHighlight } from "@/components/chat/use-verb-highlight";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/types";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const { verbs, isLoading, active, toggle } = useVerbHighlight(
    message.content,
  );

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
            <HighlightedText text={message.content} verbs={verbs} />
          ) : (
            message.content
          )}
        </div>
      </div>
    </div>
  );
}
