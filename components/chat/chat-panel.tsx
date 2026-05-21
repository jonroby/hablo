"use client";

import { MessageList } from "@/components/chat/message-list";
import { ChatInput } from "@/components/chat/chat-input";
import { useChat } from "@/components/chat/use-chat";
import type { ChatMessage } from "@/lib/types";

interface ChatPanelProps {
  messages: ChatMessage[];
  onMessagesChange: (updater: (prev: ChatMessage[]) => ChatMessage[]) => void;
}

export function ChatPanel({ messages, onMessagesChange }: ChatPanelProps) {
  const { isLoading, send } = useChat({ messages, onMessagesChange });

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col">
        <MessageList messages={messages} />
        <ChatInput onSend={send} disabled={isLoading} />
      </div>
    </div>
  );
}
