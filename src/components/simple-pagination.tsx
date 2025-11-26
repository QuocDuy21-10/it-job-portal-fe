import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SimplePaginationProps {
  /** Current active page (1-indexed) */
  page: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback to navigate to previous page */
  onPrev?: () => void;
  /** Callback to navigate to next page */
  onNext?: () => void;
  /** Callback when page changes (if you want direct control) */
  onPageChange?: (page: number) => void;
  /** Optional className for custom styling */
  className?: string;
}

/**
 * SimplePagination Component
 * 
 * A clean, minimal pagination component with prev/next navigation.
 * Features circular buttons with simple page indicator.
 * 
 * Features:
 * - Disabled state for prev/next at boundaries
 * - Flexible callback options (onPrev/onNext or onPageChange)
 * - Responsive and accessible
 * - Clean Tailwind styling
 * - Reusable across the app
 * 
 * @example
 * // Option 1: Using onPrev/onNext
 * <SimplePagination
 *   page={page}
 *   totalPages={10}
 *   onPrev={() => setPage(p => p - 1)}
 *   onNext={() => setPage(p => p + 1)}
 * />
 * 
 * @example
 * // Option 2: Using onPageChange
 * <SimplePagination
 *   page={page}
 *   totalPages={10}
 *   onPageChange={setPage}
 * />
 */
export function SimplePagination({
  page,
  totalPages,
  onPrev,
  onNext,
  onPageChange,
  className,
}: SimplePaginationProps) {
  // Determine if prev/next should be disabled
  const isPrevDisabled = page <= 1;
  const isNextDisabled = page >= totalPages;

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

  // Don't render if there's only 1 page or no pages
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={cn("flex items-center justify-center gap-6 py-2", className)}>
      {/* Previous Button - round outline */}
      <button
        onClick={handlePrevious}
        disabled={page === 1}
        aria-label="Previous page"
        className={cn(
          "h-12 w-12 flex items-center justify-center rounded-full border-2 border-green-400 bg-white text-green-500 transition-all hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-300",
          page === 1 && "opacity-50 cursor-not-allowed"
        )}
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      {/* Center page indicator */}
      <div className="flex items-center gap-2 text-lg font-medium text-muted-foreground select-none">
        <span className="text-green-600 font-bold">{page}</span>
        <span>/ {totalPages} trang</span>
      </div>

      {/* Next Button - round outline */}
      <button
        onClick={handleNext}
        disabled={page === totalPages}
        aria-label="Next page"
        className={cn(
          "h-12 w-12 flex items-center justify-center rounded-full border-2 border-primary-400 bg-white text-green-500 transition-all hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-300",
          page === totalPages && "opacity-50 cursor-not-allowed"
        )}
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
}
