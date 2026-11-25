"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  label: string;
  value: string;
}

type MultiSelectProps = {
  options: Option[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  id?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  "aria-label"?: string;
};

export const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = "Select options...",
      searchPlaceholder = "Search...",
      emptyText = "Không tìm thấy kết quả",
      className = "",
      disabled = false,
      leftIcon,
      id,
      "aria-invalid": ariaInvalid,
      "aria-describedby": ariaDescribedBy,
      "aria-label": ariaLabel,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const triggerRef = useRef<HTMLDivElement | null>(null);

    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
      if (isOpen) inputRef.current?.focus();
    }, [isOpen]);

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const close = () => {
      setIsOpen(false);
      triggerRef.current?.focus();
    };

    const toggleOption = (optionValue: string) => {
      if (value.includes(optionValue)) {
        onChange(value.filter((v) => v !== optionValue));
      } else {
        onChange([...value, optionValue]);
      }
    };

    const removeValue = (valueToRemove: string) => {
      onChange(value.filter((v) => v !== valueToRemove));
    };

    const selectedLabels = value
      .map((v) => options.find((opt) => opt.value === v)?.label)
      .filter(Boolean);

    return (
      <div
        ref={containerRef}
        data-escape-scope={isOpen ? "" : undefined}
        onKeyDown={(event) => {
          if (event.key === "Escape" && isOpen) {
            event.stopPropagation();
            close();
          }
        }}
        className={cn("relative w-full", className)}
      >
        <div className="relative">
          <div
            ref={(node) => {
              triggerRef.current = node;
              if (typeof ref === "function") ref(node);
              else if (ref) ref.current = node;
            }}
            id={id}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-invalid={ariaInvalid}
            aria-describedby={ariaDescribedBy}
            aria-label={ariaLabel}
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : 0}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            onKeyDown={(event) => {
              if (disabled || event.target !== event.currentTarget) return;
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setIsOpen(true);
              }
            }}
            className={cn(
              "flex min-h-[40px] flex-wrap items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 aria-[invalid=true]:border-error",
              disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
              isOpen && "border-primary"
            )}
          >
            {leftIcon && (
              <span className="mr-1 flex items-center text-muted-foreground">
                {leftIcon}
              </span>
            )}
            {selectedLabels.length > 0 ? (
              selectedLabels.map((label) => (
                <div
                  key={label}
                  className="flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-sm text-foreground"
                >
                  <span>{label}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      if (!disabled) {
                        e.stopPropagation();
                        const valueToRemove = options.find(
                          (opt) => opt.label === label
                        )?.value;
                        if (valueToRemove) removeValue(valueToRemove);
                      }
                    }}
                    className="rounded-full p-0.5 transition hover:bg-border"
                    aria-label={`Remove ${label}`}
                    disabled={disabled}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">
                {placeholder}
              </span>
            )}
            <div className="ml-auto">
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            </div>
          </div>

          {isOpen && !disabled && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-lg border border-border bg-popover shadow-elevation-2">
              <div className="border-b border-border p-3">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(event) =>
                    event.key === "Enter" && event.preventDefault()
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground transition-all placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <ul className="max-h-64 overflow-y-auto">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <li key={option.value}>
                      <button
                        type="button"
                        onClick={() => toggleOption(option.value)}
                        className={cn(
                          "flex w-full items-center gap-3 px-4 py-2.5 text-left transition",
                          value.includes(option.value)
                            ? "bg-primary-subtle font-medium text-primary"
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border",
                            value.includes(option.value)
                              ? "border-primary bg-primary"
                              : "border-input bg-background"
                          )}
                        >
                          {value.includes(option.value) && (
                            <svg
                              className="h-3 w-3 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                        {option.label}
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-6 text-center text-sm text-muted-foreground">
                    {emptyText}
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }
);
MultiSelect.displayName = "MultiSelect";
