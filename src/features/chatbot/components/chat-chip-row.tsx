interface ChatChipRowProps {
  items: string[];
  onSelect: (value: string) => void;
  className: string;
}

const ChatChipRow = ({ items, onSelect, className }: ChatChipRowProps) => (
  <div className={className}>
    {items.map((item) => (
      <button
        key={item}
        onClick={() => onSelect(item)}
        className="flex-shrink-0 whitespace-nowrap rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs text-blue-600 transition-colors hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
      >
        {item}
      </button>
    ))}
  </div>
);

export default ChatChipRow;
