import { useState } from 'react';
import { Chat, Message } from '../types';

export function useChatMessaging() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

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

  const handleSend = async (input: string) => {
    if (!input.trim() || isTyping) return;

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

    setChats(prev =>
      prev.map(chat =>
        chat.id === activeChatId
          ? { ...chat, messages: [...chat.messages, userMessage] }
          : chat
      )
    );

    const currentChatMessages = chats.find(c => c.id === activeChatId)?.messages || [];
    if (currentChatMessages.length === 0) {
      updateChatTitle(activeChatId, input);
    }

    setIsTyping(true);

    const assistantMessage: Message = { role: 'assistant', content: '', isTyping: true };
    setChats(prev =>
      prev.map(chat =>
        chat.id === activeChatId
          ? { ...chat, messages: [...chat.messages, assistantMessage] }
          : chat
      )
    );

    try {
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

          const correctedMatch = fullResponse.match(/Corrected:\s*(.+?)(?=\s*\nReply:)/s);
          if (correctedMatch && !correctionShown) {
            const correctedText = correctedMatch[1].trim();
            if (correctedText && correctedText !== input) {
              setChats(prev =>
                prev.map(chat => {
                  if (chat.id === activeChatId) {
                    const newMessages = [...chat.messages];
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
              await new Promise(resolve => setTimeout(resolve, 300));
            }
          }

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

      const correctedMatch = fullResponse.match(/Corrected:\s*(.+?)(?=\s*\nReply:)/s);
      const replyMatch = fullResponse.match(/Reply:\s*(.+?)(?=\s*\nTranslation:)/s);
      const translationMatch = fullResponse.match(/Translation:\s*(.+?)$/s);

      const correctedText = correctedMatch ? correctedMatch[1].trim() : '';
      const replyText = replyMatch ? replyMatch[1].trim() : fullResponse;
      const translationText = translationMatch ? translationMatch[1].trim() : '';

      if (correctedText && correctedText !== input && !correctionShown) {
        setChats(prev =>
          prev.map(chat => {
            if (chat.id === activeChatId) {
              const newMessages = [...chat.messages];
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

  return {
    chats,
    currentChatId,
    isTyping,
    setCurrentChatId,
    createNewChat,
    deleteChat,
    handleSend,
  };
}
