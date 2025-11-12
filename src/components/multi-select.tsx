
"use client";

import React from "react";

import { useState, useRef, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";


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
  className?: string;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
};



export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select options...",
  searchPlaceholder = "Search...",
  className = "",
  disabled = false,
  leftIcon,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="relative">
        <div
          onClick={() => {
            if (!disabled) {
              setIsOpen(!isOpen);
              if (!isOpen) inputRef.current?.focus();
            }
          }}
          className={`flex flex-wrap items-center gap-2 p-3 border border-border rounded-lg bg-secondary transition min-h-[44px] ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:bg-secondary/80"
          }`}
        >
          {leftIcon && (
            <span className="mr-1 flex items-center text-muted-foreground">{leftIcon}</span>
          )}
          {selectedLabels.length > 0 ? (
            selectedLabels.map((label) => (
              <div
                key={label}
                className="flex items-center gap-1 px-2 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium"
              >
                <span>{label}</span>
                <button
                  onClick={(e) => {
                    if (!disabled) {
                      e.stopPropagation();
                      const valueToRemove = options.find(
                        (opt) => opt.label === label
                      )?.value;
                      if (valueToRemove) removeValue(valueToRemove);
                    }
                  }}
                  className="hover:bg-primary/30 rounded-full p-0.5 transition"
                  aria-label={`Remove ${label}`}
                  disabled={disabled}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))
          ) : (
            <span className="text-muted-foreground text-sm">{placeholder}</span>
          )}
          <div className="ml-auto">
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        {isOpen && !disabled && (
          <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-card border border-border rounded-lg shadow-lg">
            {/* Search input */}
            <div className="p-3 border-b border-border">
              <input
                ref={inputRef}
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-secondary text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Options list */}
            <ul className="max-h-64 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <li key={option.value}>
                    <button
                      onClick={() => toggleOption(option.value)}
                      className={`w-full text-left px-4 py-2.5 flex items-center gap-3 transition ${
                        value.includes(option.value)
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-foreground hover:bg-secondary"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded border ${
                          value.includes(option.value)
                            ? "bg-primary border-primary"
                            : "border-border"
                        } flex items-center justify-center`}
                      >
                        {value.includes(option.value) && (
                          <svg
                            className="w-3 h-3 text-white"
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
                <li className="px-4 py-6 text-center text-muted-foreground text-sm">
                  No options found
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
