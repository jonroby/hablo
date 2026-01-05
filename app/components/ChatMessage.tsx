import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
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
  );
}
