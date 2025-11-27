"use client";

import { useRef, useState, useEffect, KeyboardEvent, ClipboardEvent } from "react";
import { cn } from "@/lib/utils";

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  autoFocus?: boolean;
}

export function OTPInput({
  length = 6,
  value,
  onChange,
  disabled = false,
  error = false,
  autoFocus = false,
}: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Khởi tạo array của input refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  // Auto focus vào ô đầu tiên khi mount
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const focusInput = (index: number) => {
    const input = inputRefs.current[index];
    if (input) {
      input.focus();
      input.select();
    }
  };

  const handleChange = (index: number, digit: string) => {
    if (disabled) return;

    // Chỉ cho phép số
    if (!/^\d*$/.test(digit)) return;

    const newValue = value.split("");
    newValue[index] = digit;
    const newOTP = newValue.join("");

    onChange(newOTP);

    // Tự động focus sang ô tiếp theo nếu đã nhập
    if (digit && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    // Backspace: xóa và focus về ô trước
    if (e.key === "Backspace") {
      e.preventDefault();
      const newValue = value.split("");
      
      if (newValue[index]) {
        // Nếu ô hiện tại có giá trị, xóa nó
        newValue[index] = "";
        onChange(newValue.join(""));
      } else if (index > 0) {
        // Nếu ô hiện tại trống, xóa ô trước và focus về đó
        newValue[index - 1] = "";
        onChange(newValue.join(""));
        focusInput(index - 1);
      }
    }

    // Arrow keys navigation
    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      focusInput(index - 1);
    }
    if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      focusInput(index + 1);
    }

    // Delete: xóa ô hiện tại
    if (e.key === "Delete") {
      e.preventDefault();
      const newValue = value.split("");
      newValue[index] = "";
      onChange(newValue.join(""));
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (disabled) return;

    const pastedData = e.clipboardData.getData("text/plain");
    const digits = pastedData.replace(/\D/g, "").slice(0, length);

    if (digits) {
      onChange(digits.padEnd(length, "").slice(0, length));
      // Focus vào ô cuối cùng hoặc ô tiếp theo sau số đã paste
      const nextIndex = Math.min(digits.length, length - 1);
      focusInput(nextIndex);
    }
  };

  const handleFocus = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {Array.from({ length }, (_, index) => {
        const digit = value[index] || "";
        const isActive = activeIndex === index;
        const isFilled = !!digit;

        return (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={() => handleFocus(index)}
            onPaste={handlePaste}
            disabled={disabled}
            className={cn(
              // Base styles
              "w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl",
              "transition-all duration-200 ease-out",
              "border-2 outline-none",
              
              // Background
              "bg-background dark:bg-gray-900",
              
              // Normal state
              "border-border dark:border-gray-700",
              
              // Hover state
              !disabled && "hover:border-primary/40 dark:hover:border-primary/40",
              
              // Focus state
              isActive && [
                "border-primary dark:border-primary",
                "ring-4 ring-primary/20 dark:ring-primary/30",
                "scale-105",
              ],
              
              // Filled state
              isFilled && !isActive && [
                "border-primary/60 dark:border-primary/60",
                "bg-primary/5 dark:bg-primary/10",
              ],
              
              // Error state
              error && [
                "border-destructive dark:border-red-500",
                "bg-destructive/5 dark:bg-red-500/10",
                isActive && "ring-destructive/20 dark:ring-red-500/30",
              ],
              
              // Disabled state
              disabled && [
                "opacity-50 cursor-not-allowed",
                "bg-muted dark:bg-gray-800",
              ],
              
              // Text color
              "text-foreground dark:text-white",
              error && "text-destructive dark:text-red-400"
            )}
            aria-label={`Digit ${index + 1}`}
          />
        );
      })}
    </div>
  );
}
