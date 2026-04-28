"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import SKILLS_LIST from "@/shared/data/skill-list.json";

export interface SearchSuggestInputProps {
  value: string;
  onChange: (value: string) => void;
  /** Called when user presses Enter with no active suggestion, or selects a suggestion. */
  onSubmit?: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  /** Maximum number of suggestions shown. Default: 8 */
  maxSuggestions?: number;
  size?: "default" | "lg";
  id?: string;
}

function HighlightedLabel({ label, query }: { label: string; query: string }) {
  if (!query) return <span>{label}</span>;

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = label.split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        i % 2 !== 0 ? (
          <strong key={i} className="font-semibold">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

export function SearchSuggestInput({
  value,
  onChange,
  onSubmit,
  placeholder,
  className,
  inputClassName,
  disabled = false,
  maxSuggestions = 8,
  size = "default",
  id,
}: SearchSuggestInputProps) {
  const { t } = useI18n();
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);

  const suggestions = React.useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return [];
    return SKILLS_LIST.filter((skill) =>
      skill.label.toLowerCase().includes(q)
    ).slice(0, maxSuggestions);
  }, [value, maxSuggestions]);

  const isOpen = value.trim().length > 0;

  // Reset active index whenever suggestion list changes
  React.useEffect(() => {
    setActiveIndex(-1);
  }, [suggestions]);

  function selectSuggestion(label: string) {
    onChange(label);
    onSubmit?.(label);
    inputRef.current?.blur();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) =>
          suggestions.length > 0 ? Math.min(prev + 1, suggestions.length - 1) : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, -1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && suggestions[activeIndex]) {
          selectSuggestion(suggestions[activeIndex].label);
        } else {
          onSubmit?.(value);
        }
        break;
      case "Escape":
        // Close by blurring — Radix Popover will close when trigger loses focus
        // but we keep the value; just reset active index
        setActiveIndex(-1);
        break;
    }
  }

  const heightClass = size === "lg" ? "h-14" : "h-12";

  return (
    <Popover open={isOpen}>
      <PopoverTrigger asChild>
        <div className={cn("relative", className)}>
          <Search
            className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none",
              size === "lg" ? "h-6 w-6 left-4" : "h-5 w-5"
            )}
            aria-hidden="true"
          />
          <Input
            ref={inputRef}
            id={id}
            role="combobox"
            aria-expanded={isOpen}
            aria-autocomplete="list"
            aria-activedescendant={
              activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined
            }
            autoComplete="off"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              heightClass,
              size === "lg" ? "pl-14 text-lg" : "pl-10",
              inputClassName
            )}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={() => setActiveIndex(-1)}
        align="start"
        sideOffset={4}
        className="w-[--radix-popover-trigger-width] p-0"
      >
        {suggestions.length > 0 ? (
          <ul
            ref={listRef}
            role="listbox"
            className="max-h-[280px] overflow-y-auto py-1"
          >
            {suggestions.map((skill, index) => (
              <li
                key={skill.value}
                id={`suggestion-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                onMouseDown={(e) => {
                  // Prevent input blur before click fires
                  e.preventDefault();
                  selectSuggestion(skill.label);
                }}
                onMouseEnter={() => setActiveIndex(index)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm cursor-pointer text-muted-foreground transition-colors",
                  index === activeIndex
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Search className="h-3.5 w-3.5 shrink-0 opacity-50" aria-hidden="true" />
                <HighlightedLabel label={skill.label} query={value.trim()} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-3 py-4 text-sm text-muted-foreground text-center">
            {t("search.suggest.noResult")}
          </p>
        )}
      </PopoverContent>
    </Popover>
  );
}
