import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SimplePaginationProps {
  page: number;
  totalPages: number;
  onPrev?: () => void;
  onNext?: () => void;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
  className?: string;
  showLabel?: boolean;
  labelText?: string;
}

export function SimplePagination({
  page,
  totalPages,
  onPrev,
  onNext,
  onPageChange,
  isLoading = false,
  className,
  showLabel = true,
  labelText = "trang",
}: SimplePaginationProps) {
  // Determine if prev/next should be disabled
  const isPrevDisabled = page <= 1 || isLoading;
  const isNextDisabled = page >= totalPages || isLoading;

  // Handle previous page navigation
  const handlePrevious = () => {
    if (isPrevDisabled) return;
    
    if (onPrev) {
      onPrev();
    } else if (onPageChange) {
      onPageChange(page - 1);
    }
  };

  // Handle next page navigation
  const handleNext = () => {
    if (isNextDisabled) return;
    
    if (onNext) {
      onNext();
    } else if (onPageChange) {
      onPageChange(page + 1);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, action: "prev" | "next") => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action === "prev" ? handlePrevious() : handleNext();
    }
  };

  // Don't render if there's only 1 page or no pages
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav 
      className={cn("flex items-center justify-center gap-4 sm:gap-6 py-4", className)}
      role="navigation"
      aria-label="Pagination Navigation"
    >
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        onKeyDown={(e) => handleKeyDown(e, "prev")}
        disabled={isPrevDisabled}
        aria-label="Go to previous page"
        aria-disabled={isPrevDisabled}
        className={cn(
          // Base styles
          "group relative h-10 w-10 sm:h-12 sm:w-12",
          "flex items-center justify-center",
          "rounded-full border-2",
          "transition-all duration-200 ease-out",
          
          // Theme-aware colors using design system
          "border-primary bg-background",
          "text-primary",
          
          // Interactive states
          "hover:bg-primary hover:text-primary-foreground",
          "hover:shadow-md hover:scale-105",
          "active:scale-95",
          
          // Focus states (accessibility)
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          "focus-visible:ring-offset-background",
          
          // Disabled state
          isPrevDisabled && [
            "opacity-40 cursor-not-allowed",
            "hover:bg-background hover:text-primary",
            "hover:shadow-none hover:scale-100"
          ]
        )}
      >
        <ChevronLeft 
          className={cn(
            "h-5 w-5 sm:h-6 sm:w-6 transition-transform",
            !isPrevDisabled && "group-hover:-translate-x-0.5"
          )} 
        />
      </button>

      {/* Page Indicator */}
      {showLabel && (
        <div 
          className="flex items-center gap-2 select-none px-2"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="text-base sm:text-lg font-bold text-primary tabular-nums">
            {page}
          </span>
          <span className="text-sm sm:text-base font-medium text-muted-foreground">
            / {totalPages}
          </span>
          {labelText && (
            <span className="text-sm sm:text-base font-medium text-muted-foreground">
              {labelText}
            </span>
          )}
          {isLoading && (
            <span className="ml-2 inline-flex h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden="true" />
          )}
        </div>
      )}

      {/* Next Button */}
      <button
        onClick={handleNext}
        onKeyDown={(e) => handleKeyDown(e, "next")}
        disabled={isNextDisabled}
        aria-label="Go to next page"
        aria-disabled={isNextDisabled}
        className={cn(
          // Base styles
          "group relative h-10 w-10 sm:h-12 sm:w-12",
          "flex items-center justify-center",
          "rounded-full border-2",
          "transition-all duration-200 ease-out",
          
          // Theme-aware colors using design system
          "border-primary bg-background",
          "text-primary",
          
          // Interactive states
          "hover:bg-primary hover:text-primary-foreground",
          "hover:shadow-md hover:scale-105",
          "active:scale-95",
          
          // Focus states (accessibility)
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          "focus-visible:ring-offset-background",
          
          // Disabled state
          isNextDisabled && [
            "opacity-40 cursor-not-allowed",
            "hover:bg-background hover:text-primary",
            "hover:shadow-none hover:scale-100"
          ]
        )}
      >
        <ChevronRight 
          className={cn(
            "h-5 w-5 sm:h-6 sm:w-6 transition-transform",
            !isNextDisabled && "group-hover:translate-x-0.5"
          )} 
        />
      </button>
    </nav>
  );
}
