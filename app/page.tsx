'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isTyping?: boolean;
  corrected?: string;
  translation?: string;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentChat = chats.find(chat => chat.id === currentChatId);
  const messages = currentChat?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
  };

  const updateChatTitle = (chatId: string, firstMessage: string) => {
    setChats(prev =>
      prev.map(chat =>
        chat.id === chatId
          ? { ...chat, title: firstMessage.slice(0, 30) + (firstMessage.length > 30 ? '...' : '') }
          : chat
      )
    );
  };

  const deleteChat = (chatId: string) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId(null);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    // Create new chat if none exists
    let activeChatId = currentChatId;
    if (!activeChatId) {
      const newChat: Chat = {
        id: Date.now().toString(),
        title: input.slice(0, 30) + (input.length > 30 ? '...' : ''),
        messages: [],
        createdAt: Date.now(),
      };
      setChats(prev => [newChat, ...prev]);
      activeChatId = newChat.id;
      setCurrentChatId(activeChatId);
    }

    const userMessage: Message = { role: 'user', content: input };

    // Update chat with user message
    setChats(prev =>
      prev.map(chat =>
        chat.id === activeChatId
          ? { ...chat, messages: [...chat.messages, userMessage] }
          : chat
      )
    );

    // Update title if this is the first message
    const currentChatMessages = chats.find(c => c.id === activeChatId)?.messages || [];
    if (currentChatMessages.length === 0) {
      updateChatTitle(activeChatId, input);
    }

    setInput('');
    setIsTyping(true);

    // Add assistant message placeholder
    const assistantMessage: Message = { role: 'assistant', content: '', isTyping: true };
    setChats(prev =>
      prev.map(chat =>
        chat.id === activeChatId
          ? { ...chat, messages: [...chat.messages, assistantMessage] }
          : chat
      )
    );

    try {
      // Get current chat messages for context
      const chatMessages = [...(chats.find(c => c.id === activeChatId)?.messages || []), userMessage];

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: chatMessages.map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';
      let correctionShown = false;

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          fullResponse += chunk;

          // Check if we have the corrected part and show it before the reply
          const correctedMatch = fullResponse.match(/Corrected:\s*(.+?)(?=\s*\nReply:)/s);
          if (correctedMatch && !correctionShown) {
            const correctedText = correctedMatch[1].trim();
            if (correctedText && correctedText !== input) {
              setChats(prev =>
                prev.map(chat => {
                  if (chat.id === activeChatId) {
                    const newMessages = [...chat.messages];
                    // Find the user message (second to last)
                    const userMessageIndex = newMessages.length - 2;
                    if (userMessageIndex >= 0 && newMessages[userMessageIndex].role === 'user') {
                      newMessages[userMessageIndex] = {
                        ...newMessages[userMessageIndex],
                        corrected: correctedText,
                      };
                    }
                    return { ...chat, messages: newMessages };
                  }
                  return chat;
                })
              );
              correctionShown = true;
              // Small delay so user sees the correction before the reply starts
              await new Promise(resolve => setTimeout(resolve, 300));
            }
          }

          // Parse in real-time to extract only the reply part
          const replyMatch = fullResponse.match(/Reply:\s*(.+?)(?=\s*\nTranslation:|$)/s);
          const displayText = replyMatch ? replyMatch[1].trim() : '';

          setChats(prev =>
            prev.map(chat => {
              if (chat.id === activeChatId) {
                const newMessages = [...chat.messages];
                newMessages[newMessages.length - 1] = {
                  role: 'assistant',
                  content: displayText,
                  isTyping: true,
                };
                return { ...chat, messages: newMessages };
              }
              return chat;
            })
          );
        }
      }

      // Parse the final response to extract all parts
      const correctedMatch = fullResponse.match(/Corrected:\s*(.+?)(?=\s*\nReply:)/s);
      const replyMatch = fullResponse.match(/Reply:\s*(.+?)(?=\s*\nTranslation:)/s);
      const translationMatch = fullResponse.match(/Translation:\s*(.+?)$/s);

      const correctedText = correctedMatch ? correctedMatch[1].trim() : '';
      const replyText = replyMatch ? replyMatch[1].trim() : fullResponse;
      const translationText = translationMatch ? translationMatch[1].trim() : '';

      // Update user message with correction if not already shown
      if (correctedText && correctedText !== input && !correctionShown) {
        setChats(prev =>
          prev.map(chat => {
            if (chat.id === activeChatId) {
              const newMessages = [...chat.messages];
              // Find the user message (second to last)
              const userMessageIndex = newMessages.length - 2;
              if (userMessageIndex >= 0 && newMessages[userMessageIndex].role === 'user') {
                newMessages[userMessageIndex] = {
                  ...newMessages[userMessageIndex],
                  corrected: correctedText,
                };
              }
              return { ...chat, messages: newMessages };
            }
            return chat;
          })
        );
      }

      // Mark as done typing and set only the reply part with translation
      setChats(prev =>
        prev.map(chat => {
          if (chat.id === activeChatId) {
            const newMessages = [...chat.messages];
            newMessages[newMessages.length - 1] = {
              role: 'assistant',
              content: replyText,
              translation: translationText,
              isTyping: false,
            };
            return { ...chat, messages: newMessages };
          }
          return chat;
        })
      );
    } catch (error) {
      console.error('Error:', error);
      setChats(prev =>
        prev.map(chat => {
          if (chat.id === activeChatId) {
            const newMessages = [...chat.messages];
            newMessages[newMessages.length - 1] = {
              role: 'assistant',
              content: 'Sorry, I encountered an error. Please try again.',
              isTyping: false,
            };
            return { ...chat, messages: newMessages };
          }
          return chat;
        })
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen bg-white dark:bg-zinc-900">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'w-64' : 'w-0'
        } transition-all duration-300 border-r border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 flex flex-col overflow-hidden`}
      >
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
          <button
            onClick={createNewChat}
            className="w-full rounded-lg bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
          >
            + New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {chats.map(chat => (
            <div
              key={chat.id}
              className={`group mb-2 flex items-center justify-between rounded-lg p-3 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 ${
                currentChatId === chat.id
                  ? 'bg-zinc-200 dark:bg-zinc-800'
                  : ''
              }`}
              onClick={() => setCurrentChatId(chat.id)}
            >
              <span className="flex-1 truncate text-sm text-zinc-900 dark:text-zinc-100">
                {chat.title}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat.id);
                }}
                className="opacity-0 group-hover:opacity-100 ml-2 text-zinc-500 hover:text-red-500"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="border-b border-zinc-200 dark:border-zinc-700 p-4 flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {currentChat?.title || 'Chat'}
          </h1>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-4 py-8">
            {messages.length === 0 && (
              <div className="flex h-full items-center justify-center text-zinc-400">
                Start a new conversation
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
                  } ${message.role === 'assistant' && message.translation ? 'group relative' : ''}`}
                >
                  <div className="whitespace-pre-wrap break-words">
                    {message.content}
                    {message.isTyping && (
                      <span className="inline-block ml-1 w-1 h-4 bg-current animate-pulse" />
                    )}
                  </div>
                  {message.role === 'user' && message.corrected && (
                    <div className="mt-2 pt-2 border-t border-blue-400 text-sm opacity-90">
                      ✓ {message.corrected}
                    </div>
                  )}
                  {message.role === 'assistant' && message.translation && (
                    <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-max max-w-sm rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white shadow-lg dark:bg-zinc-700">
                      {message.translation}
                      <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-zinc-800 dark:border-t-zinc-700"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="border-t border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
          <div className="mx-auto max-w-3xl px-4 py-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                disabled={isTyping}
                className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="rounded-lg bg-blue-500 px-6 py-2 font-medium text-white hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
