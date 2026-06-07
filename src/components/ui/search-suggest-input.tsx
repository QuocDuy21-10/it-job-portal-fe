"use client";

import * as React from "react";
import { Search, X, Clock, Code2, Briefcase, Sparkles, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import { useSkillCatalog } from "@/hooks/use-skill-catalog";

export interface SearchSuggestInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  maxSuggestions?: number;
  size?: "default" | "lg";
  id?: string;
  noBorder?: boolean;
  forceClose?: boolean;
}

const POPULAR_SKILLS = [
  { label: "React.JS", value: "REACT.JS" },
  { label: "Next.JS", value: "NEXT.JS" },
  { label: "JavaScript", value: "JAVASCRIPT" },
  { label: "Python", value: "PYTHON" },
  { label: "Figma", value: "FIGMA" },
  { label: "Docker", value: "DOCKER" }
];

const CATEGORY_KEYWORDS = new Set([
  "frontend", "backend", "fullstack", "devops", "ui/ux design", 
  "project management", "data science", "machine learning", 
  "mobile development", "web development", "cloud computing", 
  "devsecops", "agile", "scrum", "kanban"
]);

function getSuggestionIcon(label: string) {
  if (CATEGORY_KEYWORDS.has(label.toLowerCase())) {
    return Briefcase;
  }
  return Code2;
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
          <strong key={i} className="font-bold text-primary dark:text-blue-400">
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
  maxSuggestions = 6,
  size = "default",
  id,
  noBorder = false,
  forceClose = false,
}: SearchSuggestInputProps) {
  const { t } = useI18n();
  const { skillOptions } = useSkillCatalog();
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [isFocused, setIsFocused] = React.useState(false);
  const [history, setHistory] = React.useState<string[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);
  const listboxId = React.useId();

  // Load history from localStorage (hydration-safe)
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("job_portal_search_history");
      if (saved) {
        try {
          setHistory(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse search history", e);
        }
      }
    }
  }, []);

  const saveToHistory = React.useCallback((term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
      const next = [trimmed, ...filtered].slice(0, 5);
      localStorage.setItem("job_portal_search_history", JSON.stringify(next));
      return next;
    });
  }, []);

  const deleteFromHistory = React.useCallback((e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    e.preventDefault();
    setHistory((prev) => {
      const next = prev.filter((item) => item !== term);
      localStorage.setItem("job_portal_search_history", JSON.stringify(next));
      return next;
    });
  }, []);

  const hasMinQuery = value.trim().length >= 2;

  const suggestions = React.useMemo(() => {
    const q = value.trim().toLowerCase();
    if (q.length < 2) return [];
    return skillOptions.filter((skill) =>
      skill.label.toLowerCase().includes(q)
    ).slice(0, maxSuggestions);
  }, [value, maxSuggestions, skillOptions]);

  // Combined items list for keyboard navigation
  const listItems = React.useMemo(() => {
    if (hasMinQuery) {
      return suggestions;
    }
    return history.map((h) => ({ label: h, value: h }));
  }, [hasMinQuery, suggestions, history]);

  const [dropdownStyle, setDropdownStyle] = React.useState<React.CSSProperties>({
    position: "absolute",
    left: 0,
    right: 0,
    top: "100%",
  });

  const isOpen = !disabled && isFocused && !forceClose;

  React.useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const handleResize = () => {
      const container = containerRef.current;
      if (!container) return;

      const parentSearchBox = container.closest(".listing-panel-surface");
      if (parentSearchBox) {
        const parentRect = parentSearchBox.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const leftOffset = parentRect.left - containerRect.left;
        
        setDropdownStyle({
          position: "absolute",
          left: `${leftOffset}px`,
          width: `${parentRect.width}px`,
          top: "100%",
        });
      } else {
        setDropdownStyle({
          position: "absolute",
          left: 0,
          right: 0,
          top: "100%",
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  // Reset active index whenever suggestion/history list changes
  React.useEffect(() => {
    setActiveIndex(-1);
  }, [listItems]);

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
    saveToHistory(label);
    onSubmit?.(label);
    closeSuggestions();
    inputRef.current?.blur();
  }, [closeSuggestions, onChange, onSubmit, saveToHistory]);

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
          listItems.length > 0 ? Math.min(prev + 1, listItems.length - 1) : prev
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
        e.preventDefault();
        if (activeIndex >= 0 && listItems[activeIndex]) {
          selectSuggestion(listItems[activeIndex].label);
        } else if (value.trim()) {
          saveToHistory(value);
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
      className={cn("relative w-full", className)}
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
          noBorder && "border-0 shadow-none focus-visible:ring-0 focus-visible:border-transparent outline-none",
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
        <div
          style={dropdownStyle}
          className="absolute z-[100] mt-2 overflow-hidden rounded-xl border border-border/80 bg-background/95 backdrop-blur-md text-foreground shadow-xl dark:shadow-black/40 animate-in fade-in slide-in-from-top-2 duration-200 p-2"
        >
          {hasMinQuery ? (
            suggestions.length > 0 ? (
              <ul
                ref={listRef}
                id={listboxId}
                role="listbox"
                className="max-h-[280px] overflow-y-auto space-y-0.5"
              >
                {suggestions.map((skill, index) => {
                  const Icon = getSuggestionIcon(skill.label);
                  const isSelected = index === activeIndex;
                  return (
                    <li
                      key={skill.value}
                      id={`${listboxId}-option-${index}`}
                      role="option"
                      aria-selected={isSelected}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        selectSuggestion(skill.label);
                      }}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={cn(
                        "flex cursor-pointer items-center justify-between px-3 py-3 text-sm text-muted-foreground rounded-lg transition-all duration-200 h-12 select-none",
                        isSelected
                          ? "bg-accent text-accent-foreground translate-x-1"
                          : "hover:bg-accent/70 hover:text-accent-foreground hover:translate-x-1"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 shrink-0 text-muted-foreground/65" aria-hidden="true" />
                        <span className="text-foreground font-medium">
                          <HighlightedLabel label={skill.label} query={value.trim()} />
                        </span>
                      </div>
                      <ChevronRight className={cn(
                        "h-4 w-4 shrink-0 transition-opacity duration-200",
                        isSelected ? "opacity-100 text-primary" : "opacity-0"
                      )} />
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <Search className="h-8 w-8 text-muted-foreground/40 mb-2 animate-pulse" />
                <p className="text-sm font-semibold text-foreground">
                  {t("search.suggest.noResultTitle") || "No results matching"}
                </p>
                <p className="text-xs text-muted-foreground mt-1 max-w-[240px] leading-relaxed">
                  {t("search.suggest.noResult")}
                </p>
              </div>
            )
          ) : (
            <div className="space-y-4 p-2">
              {history.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider px-1 flex items-center gap-1.5 select-none">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Recent Searches</span>
                  </div>
                  <ul ref={listRef} className="space-y-0.5">
                    {history.map((term, index) => {
                      const isSelected = index === activeIndex;
                      return (
                        <li
                          key={term}
                          role="option"
                          aria-selected={isSelected}
                          onMouseDown={(event) => {
                            event.preventDefault();
                            selectSuggestion(term);
                          }}
                          onMouseEnter={() => setActiveIndex(index)}
                          className={cn(
                            "flex cursor-pointer items-center justify-between px-3 py-3 text-sm text-muted-foreground rounded-lg transition-all duration-200 h-12 select-none",
                            isSelected
                              ? "bg-accent text-accent-foreground translate-x-1"
                              : "hover:bg-accent/70 hover:text-accent-foreground hover:translate-x-1"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Clock className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                            <span className="text-foreground font-medium">{term}</span>
                          </div>
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                            }}
                            onClick={(e) => deleteFromHistory(e, term)}
                            className="p-1.5 rounded-full text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors focus-visible:outline-none"
                            aria-label={`Delete ${term} from history`}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              <div className="space-y-2 select-none">
                <div className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider px-1 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                  <span>Popular Skills</span>
                </div>
                <div className="flex flex-wrap gap-2 px-1">
                  {POPULAR_SKILLS.map((skill) => (
                    <button
                      key={skill.value}
                      type="button"
                      onMouseDown={(event) => {
                        event.preventDefault();
                        selectSuggestion(skill.label);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-secondary text-foreground hover:bg-primary/15 hover:text-primary border border-border/80 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                    >
                      {skill.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

