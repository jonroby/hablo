import { TranslationToggle } from "@/components/chat/translation-toggle";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/types";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex items-center gap-1.5",
        isUser ? "flex-row-reverse" : "justify-start",
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
          isUser
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md bg-muted text-foreground",
        )}
      >
        {message.content}
      </div>

      {message.translation ? (
        <TranslationToggle
          text={message.translation}
          align={isUser ? "end" : "start"}
        />
      ) : null}
    </div>
  );
}
