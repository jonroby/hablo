interface ChatHeaderProps {
  title: string;
  onToggleSidebar: () => void;
}

export default function ChatHeader({ title, onToggleSidebar }: ChatHeaderProps) {
  return (
    <div className="border-b border-zinc-200 dark:border-zinc-700 p-4 flex items-center gap-3">
      <button
        onClick={onToggleSidebar}
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
        {title}
      </h1>
    </div>
  );
}
