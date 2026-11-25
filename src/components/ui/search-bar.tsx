"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

const DEBOUNCE_MS = 300;

export interface SearchBarProps {
  value: string;
  onSearch: (value: string) => void;
  placeholder: string;
  className?: string;
}

export function SearchBar({
  value,
  onSearch,
  placeholder,
  className,
}: SearchBarProps) {
  const { t } = useI18n();
  const [text, setText] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const submitted = useRef(value);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  // Only a value set from outside replaces the text: our own echo would undo newer typing.
  useEffect(() => {
    if (value === submitted.current) return;
    submitted.current = value;
    clearTimeout(timer.current);
    setText(value);
  }, [value]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const submit = (next: string) => {
    clearTimeout(timer.current);
    const trimmed = next.trim();
    if (trimmed === submitted.current) return;
    submitted.current = trimmed;
    onSearch(trimmed);
  };

  const change = (next: string) => {
    setText(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => submit(next), DEBOUNCE_MS);
  };

  return (
    <div className={cn("relative", className)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        ref={inputRef}
        type="search"
        value={text}
        maxLength={100}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(event) => change(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") submit(text);
        }}
        className={cn(
          "h-11 pl-9 text-base focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:h-9 md:text-sm [&::-webkit-search-cancel-button]:hidden",
          text && "pr-11 md:pr-9"
        )}
      />
      {text && (
        <button
          type="button"
          aria-label={t("adminPages.filters.clearSearch")}
          onClick={() => {
            setText("");
            submit("");
            // This button is about to disappear and would take focus with it.
            inputRef.current?.focus();
          }}
          className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:h-9 md:w-9"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
