"use client";

import { AppShell } from "@/components/layout/app-shell";
import { useSidebar } from "@/components/layout/use-sidebar";
import { Sidebar } from "@/components/conversations/sidebar";
import { useConversations } from "@/components/conversations/use-conversations";
import { ChatPanel } from "@/components/chat/chat-panel";

export default function Home() {
  const {
    conversations,
    activeId,
    active,
    selectConversation,
    newConversation,
    deleteConversation,
    updateActiveMessages,
  } = useConversations();
  const sidebar = useSidebar();

  return (
    <AppShell
      sidebarOpen={sidebar.isOpen}
      onOpenSidebar={sidebar.open}
      sidebar={
        <Sidebar
          conversations={conversations}
          activeId={activeId}
          onSelect={selectConversation}
          onNew={newConversation}
          onDelete={deleteConversation}
          onClose={sidebar.close}
        />
      }
    >
      {active ? (
        <ChatPanel
          key={active.id}
          messages={active.messages}
          onMessagesChange={updateActiveMessages}
        />
      ) : (
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          Crea una conversación para empezar.
        </div>
      )}
    </AppShell>
  );
}
