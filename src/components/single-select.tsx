"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

const normalizeSearchText = (value: string) =>
  value
    .toLowerCase()
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();

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
  noBorder?: boolean;
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
  noBorder = false,
}: SingleSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const normalizedSearchTerm = normalizeSearchText(searchTerm);
  const filteredOptions = options.filter((option) =>
    normalizeSearchText(option.label).includes(normalizedSearchTerm)
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
  const isSearchSurface = noBorder;

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
          className={noBorder
            ? `flex items-center gap-2 p-3 transition-all min-h-[44px] ${
                disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              } ${isSearchSurface ? "dark:text-white" : ""}`
            : `flex items-center gap-2 p-3 border rounded-lg bg-white dark:bg-slate-900 transition-all min-h-[44px] ${
                disabled
                  ? "opacity-50 cursor-not-allowed border-slate-200 dark:border-slate-800"
                  : "cursor-pointer hover:border-blue-400 dark:hover:border-blue-600 border-slate-300 dark:border-slate-700"
              } ${isOpen ? "ring-2 ring-blue-500 dark:ring-blue-600 border-blue-500 dark:border-blue-600" : ""}`}
        >
          {leftIcon && (
            <span className={`flex items-center ${isSearchSurface ? "text-slate-500 dark:text-white/70" : "text-slate-500 dark:text-slate-400"}`}>
              {leftIcon}
            </span>
          )}
          
          <div className="flex-1 flex items-center gap-2">
            {selectedLabel ? (
              <span className={`text-sm ${isSearchSurface ? "text-slate-900 dark:text-white" : "text-slate-900 dark:text-slate-100"}`}>
                {selectedLabel}
              </span>
            ) : (
              <span className={`text-sm ${isSearchSurface ? "text-slate-500 dark:text-white/70" : "text-slate-500 dark:text-slate-400"}`}>
                {placeholder}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {allowClear && value && !disabled && (
              <button
                onClick={clearValue}
                className={`rounded-full p-1 transition ${isSearchSurface ? "hover:bg-slate-200 dark:hover:bg-white/10" : "hover:bg-slate-200 dark:hover:bg-slate-700"}`}
                aria-label="Clear selection"
              >
                <X className={`h-4 w-4 ${isSearchSurface ? "text-slate-500 dark:text-white/70" : "text-slate-500 dark:text-slate-400"}`} />
              </button>
            )}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${isSearchSurface ? "text-slate-500 dark:text-white/70" : "text-slate-500 dark:text-slate-400"} ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        {isOpen && !disabled && (
          <div className={`absolute left-0 right-0 top-full z-[100] mt-2 max-w-full rounded-lg border bg-white shadow-xl ${isSearchSurface ? "dark:border-white/10 dark:bg-[#101528]" : "dark:border-slate-700 dark:bg-slate-900"} border-slate-200`}>
            {/* Search input */}
            <div className={`border-b p-3 ${isSearchSurface ? "border-slate-200 dark:border-white/10" : "border-slate-200 dark:border-slate-800"}`}>
              <input
                ref={inputRef}
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 text-slate-900 transition-all placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isSearchSurface ? "dark:border-white/10 dark:bg-[#101528] dark:text-white dark:placeholder:text-white/60 dark:focus:border-blue-400 dark:focus:ring-blue-400" : "dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-blue-600 dark:focus:ring-blue-600"} border-slate-300 bg-white`}
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
                          ? isSearchSurface
                            ? "bg-blue-50 font-medium text-blue-700 dark:bg-white/10 dark:text-white"
                            : "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium"
                          : isSearchSurface
                            ? "text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                            : "text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                          value === option.value
                            ? "border-blue-600 bg-blue-600 dark:border-blue-500 dark:bg-blue-500"
                            : isSearchSurface
                              ? "border-slate-300 bg-white dark:border-white/20 dark:bg-[#101528]"
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
                <li className={`px-4 py-6 text-center text-sm ${isSearchSurface ? "text-slate-500 dark:text-white/70" : "text-slate-500 dark:text-slate-400"}`}>
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
