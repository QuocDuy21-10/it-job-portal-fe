"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

type SingleSelectProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  allowClear?: boolean;
};

export function SingleSelect({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  className = "",
  disabled = false,
  leftIcon,
  allowClear = true,
}: SingleSelectProps) {
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

  const selectOption = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  const clearValue = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

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
          className={`flex items-center gap-2 p-3 border rounded-lg bg-white dark:bg-slate-900 transition-all min-h-[44px] ${
            disabled
              ? "opacity-50 cursor-not-allowed border-slate-200 dark:border-slate-800"
              : "cursor-pointer hover:border-blue-400 dark:hover:border-blue-600 border-slate-300 dark:border-slate-700"
          } ${isOpen ? "ring-2 ring-blue-500 dark:ring-blue-600 border-blue-500 dark:border-blue-600" : ""}`}
        >
          {leftIcon && (
            <span className="flex items-center text-slate-500 dark:text-slate-400">
              {leftIcon}
            </span>
          )}
          
          <div className="flex-1 flex items-center gap-2">
            {selectedLabel ? (
              <span className="text-slate-900 dark:text-slate-100 text-sm">
                {selectedLabel}
              </span>
            ) : (
              <span className="text-slate-500 dark:text-slate-400 text-sm">
                {placeholder}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {allowClear && value && !disabled && (
              <button
                onClick={clearValue}
                className="hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full p-1 transition"
                aria-label="Clear selection"
              >
                <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              </button>
            )}
            <ChevronDown
              className={`w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        {isOpen && !disabled && (
          <div className="absolute top-full left-0 right-0 mt-2 z-[100] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl max-w-full">
            {/* Search input */}
            <div className="p-3 border-b border-slate-200 dark:border-slate-800">
              <input
                ref={inputRef}
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 transition-all"
              />
            </div>

            {/* Options list */}
            <ul className="max-h-64 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <li key={option.value}>
                    <button
                      onClick={() => selectOption(option.value)}
                      className={`w-full text-left px-4 py-2.5 flex items-center gap-3 transition ${
                        value === option.value
                          ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium"
                          : "text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                          value === option.value
                            ? "bg-blue-600 dark:bg-blue-500 border-blue-600 dark:border-blue-500"
                            : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                        }`}
                      >
                        {value === option.value && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      {option.label}
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-4 py-6 text-center text-slate-500 dark:text-slate-400 text-sm">
                  Không tìm thấy kết quả
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
