"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
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
  const [isFocused, setIsFocused] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);
  const listboxId = React.useId();

  const suggestions = React.useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return [];
    return SKILLS_LIST.filter((skill) =>
      skill.label.toLowerCase().includes(q)
    ).slice(0, maxSuggestions);
  }, [value, maxSuggestions]);

  const hasQuery = value.trim().length > 0;
  const isOpen = !disabled && isFocused && hasQuery;

  // Reset active index whenever suggestion list changes
  React.useEffect(() => {
    setActiveIndex(-1);
  }, [suggestions]);

  React.useEffect(() => {
    if (activeIndex < 0) {
      return;
    }

    const activeItem = listRef.current?.children.item(activeIndex);
    if (activeItem instanceof HTMLElement) {
      activeItem.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  const closeSuggestions = React.useCallback(() => {
    setIsFocused(false);
    setActiveIndex(-1);
  }, []);

  React.useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (!containerRef.current?.contains(target)) {
        closeSuggestions();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [closeSuggestions]);

  const selectSuggestion = React.useCallback((label: string) => {
    onChange(label);
    onSubmit?.(label);
    closeSuggestions();
    inputRef.current?.blur();
  }, [closeSuggestions, onChange, onSubmit]);

  const handleBlurCapture = React.useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      const nextTarget = event.relatedTarget;

      if (nextTarget instanceof Node && containerRef.current?.contains(nextTarget)) {
        return;
      }

      closeSuggestions();
    },
    [closeSuggestions]
  );

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
      setIsFocused(true);
    },
    [onChange]
  );

  const handleFocus = React.useCallback(() => {
    if (!disabled) {
      setIsFocused(true);
    }
  }, [disabled]);

  const handleClear = React.useCallback(() => {
    onChange("");
    setActiveIndex(-1);
    setIsFocused(true);
    inputRef.current?.focus();
  }, [onChange]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case "ArrowDown":
        if (!isOpen) {
          return;
        }

        e.preventDefault();
        setActiveIndex((prev) =>
          suggestions.length > 0 ? Math.min(prev + 1, suggestions.length - 1) : prev
        );
        break;
      case "ArrowUp":
        if (!isOpen) {
          return;
        }

        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, -1));
        break;
      case "Enter":
        if (!hasQuery) {
          return;
        }

        e.preventDefault();
        if (activeIndex >= 0 && suggestions[activeIndex]) {
          selectSuggestion(suggestions[activeIndex].label);
        } else {
          onSubmit?.(value);
          closeSuggestions();
          inputRef.current?.blur();
        }
        break;
      case "Escape":
        closeSuggestions();
        inputRef.current?.blur();
        break;
    }
  }

  const heightClass = size === "lg" ? "h-14" : "h-12";

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      onBlurCapture={handleBlurCapture}
    >
      <Input
        ref={inputRef}
        id={id}
        role="combobox"
        aria-controls={isOpen ? listboxId : undefined}
        aria-expanded={isOpen}
        aria-autocomplete="list"
        aria-activedescendant={
          activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
        }
        autoComplete="off"
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          heightClass,
          size === "lg" ? "pl-4 pr-14 text-lg" : "pl-4 pr-14",
          inputClassName
        )}
      />

      {value.length > 0 && !disabled && (
        <button
          type="button"
          aria-label={t("search.suggest.clear")}
          onMouseDown={(event) => event.preventDefault()}
          onClick={handleClear}
          className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md">
          {suggestions.length > 0 ? (
            <ul
              ref={listRef}
              id={listboxId}
              role="listbox"
              className="max-h-[280px] overflow-y-auto py-1"
            >
              {suggestions.map((skill, index) => (
                <li
                  key={skill.value}
                  id={`${listboxId}-option-${index}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    selectSuggestion(skill.label);
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-muted-foreground transition-colors",
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
            <p className="px-3 py-4 text-center text-sm text-muted-foreground">
              {t("search.suggest.noResult")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
