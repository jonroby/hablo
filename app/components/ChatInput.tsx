interface ChatInputProps {
  input: string;
  isTyping: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export default function ChatInput({
  input,
  isTyping,
  onInputChange,
  onSend,
  onKeyPress,
}: ChatInputProps) {
  return (
    <div className="border-t border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mx-auto max-w-3xl px-4 py-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Type a message..."
            disabled={isTyping}
            className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
          />
          <button
            onClick={onSend}
            disabled={!input.trim() || isTyping}
            className="rounded-lg bg-blue-500 px-6 py-2 font-medium text-white hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
