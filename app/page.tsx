'use client';

import { useState, useRef, useEffect } from 'react';
import ChatSidebar from './components/ChatSidebar';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import { useChatMessaging } from './hooks/useChatMessaging';

export default function Home() {
  const [input, setInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    chats,
    currentChatId,
    isTyping,
    setCurrentChatId,
    createNewChat,
    deleteChat,
    handleSend,
  } = useChatMessaging();

  const currentChat = chats.find(chat => chat.id === currentChatId);
  const messages = currentChat?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onSend = () => {
    handleSend(input);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex h-screen bg-white dark:bg-zinc-900">
      <ChatSidebar
        chats={chats}
        currentChatId={currentChatId}
        isOpen={isSidebarOpen}
        onNewChat={createNewChat}
        onSelectChat={setCurrentChatId}
        onDeleteChat={deleteChat}
      />

      <div className="flex flex-1 flex-col">
        <ChatHeader
          title={currentChat?.title || 'Chat'}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <MessageList messages={messages} messagesEndRef={messagesEndRef} />

        <ChatInput
          input={input}
          isTyping={isTyping}
          onInputChange={setInput}
          onSend={onSend}
          onKeyPress={handleKeyPress}
        />
      </div>
    </div>
  );
}
