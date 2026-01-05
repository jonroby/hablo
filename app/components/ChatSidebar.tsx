import { Chat } from '../types';

interface ChatSidebarProps {
  chats: Chat[];
  currentChatId: string | null;
  isOpen: boolean;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
}

export default function ChatSidebar({
  chats,
  currentChatId,
  isOpen,
  onNewChat,
  onSelectChat,
  onDeleteChat,
}: ChatSidebarProps) {
  return (
    <div
      className={`${
        isOpen ? 'w-64' : 'w-0'
      } transition-all duration-300 border-r border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 flex flex-col overflow-hidden`}
    >
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
        <button
          onClick={onNewChat}
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
            onClick={() => onSelectChat(chat.id)}
          >
            <span className="flex-1 truncate text-sm text-zinc-900 dark:text-zinc-100">
              {chat.title}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChat(chat.id);
              }}
              className="opacity-0 group-hover:opacity-100 ml-2 text-zinc-500 hover:text-red-500"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
