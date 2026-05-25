import { MessageControls } from "@/components/chat/message-controls";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/types";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex flex-col", isUser ? "items-end" : "items-start")}>
      <div className="flex max-w-[80%] flex-col gap-1">
        <div className="flex justify-end">
          <MessageControls
            text={message.content}
            translation={message.translation}
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
          {message.content}
        </div>
      </div>
    </div>
  );
}
