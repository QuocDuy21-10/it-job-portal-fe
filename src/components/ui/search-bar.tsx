"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

export interface SearchBarProps {
  /** Initial search value */
  value?: string;
  
  onSearch: (value: string) => void;
  placeholder?: string;
  debounceDelay?: number;
  showClearButton?: boolean;
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  width?: "full" | "auto" | "sm" | "md" | "lg";
}

/**
 * SearchBar Component
 * 
 * Reusable search input with debounce, clear button, and flexible styling.
 * Replaces: UserSearchBar, CompanySearchBar, JobSearchBar, RoleSearchBar, etc.
 * 
 * Features:
 * ✅ Debounced input to reduce API calls
 * ✅ Optional clear button
 * ✅ Customizable placeholder, icon, size
 * ✅ Responsive width options
 * ✅ Accessible with ARIA labels
 * ✅ Smooth animations
 * 
 * @example
 * // Basic usage
 * <SearchBar
 *   placeholder="Search..."
 *   onSearch={handleSearch}
 * />
 * 
 * @example
 * // With custom delay and clear button
 * <SearchBar
 *   placeholder="Search companies..."
 *   onSearch={setCompanyQuery}
 *   debounceDelay={800}
 *   showClearButton
 *   width="lg"
 * />
 */
export function SearchBar({
  value = "",
  onSearch,
  placeholder = "Search...",
  debounceDelay = 500,
  showClearButton = true,
  icon,
  className,
  disabled = false,
  size = "md",
  width = "sm",
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(value);
  const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay);

  // Sync with external value changes
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  // Trigger search callback when debounced value changes
  useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  const handleClear = () => {
    setSearchTerm("");
  };

  // Memoize size classes
  const sizeClasses = useMemo(() => {
    const sizes = {
      sm: "h-8 text-sm",
      md: "h-10 text-sm",
      lg: "h-12 text-base",
    };
    return sizes[size] || sizes.md;
  }, [size]);

  // Memoize width classes
  const widthClasses = useMemo(() => {
    const widths = {
      full: "w-full",
      auto: "w-auto",
      sm: "w-full max-w-xs",
      md: "w-full max-w-md",
      lg: "w-full max-w-lg",
    };
    return widths[width] || widths.sm;
  }, [width]);

  return (
    <div className={cn("relative", widthClasses, className)}>
      {/* Search Icon */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
        {icon || (
          <Search
            className={cn(
              "text-gray-400 dark:text-gray-500 transition-colors",
              size === "sm" && "h-3.5 w-3.5",
              size === "md" && "h-4 w-4",
              size === "lg" && "h-5 w-5"
            )}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Input Field */}
      <Input
        type="search"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        disabled={disabled}
        className={cn(
          sizeClasses,
          "pl-9",
          showClearButton && searchTerm && "pr-9",
          "bg-white dark:bg-gray-900",
          "border-gray-300 dark:border-gray-700",
          "focus:border-blue-500 dark:focus:border-blue-500",
          "focus:ring-2 focus:ring-blue-500/20",
          "transition-all duration-200",
          "placeholder:text-gray-400 dark:placeholder:text-gray-500"
        )}
        aria-label={placeholder}
      />

      {/* Clear Button */}
      {showClearButton && searchTerm && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2",
            "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300",
            "transition-colors duration-200",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-sm"
          )}
          aria-label="Clear search"
        >
          <X
            className={cn(
              size === "sm" && "h-3.5 w-3.5",
              size === "md" && "h-4 w-4",
              size === "lg" && "h-5 w-5"
            )}
          />
        </button>
      )}
    </div>
  );
}
