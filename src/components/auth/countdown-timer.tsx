"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  initialSeconds: number;
  onComplete?: () => void;
  isActive?: boolean;
  className?: string;
}

export function CountdownTimer({
  initialSeconds,
  onComplete,
  isActive = true,
  className,
}: CountdownTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (!isActive || seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, seconds, onComplete]);

  // Reset timer khi initialSeconds thay đổi
  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const progress = (seconds / initialSeconds) * 100;
  const isLowTime = seconds <= 30;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <Clock
          className={cn(
            "w-5 h-5 transition-colors",
            isLowTime ? "text-destructive animate-pulse" : "text-muted-foreground"
          )}
        />
        {/* Circular progress */}
        <svg
          className="absolute inset-0 w-5 h-5 -rotate-90"
          viewBox="0 0 20 20"
        >
          <circle
            cx="10"
            cy="10"
            r="8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={cn(
              "transition-all duration-1000",
              isLowTime ? "stroke-destructive/30" : "stroke-primary/30"
            )}
            strokeDasharray={`${progress} 100`}
          />
        </svg>
      </div>
      
      <span
        className={cn(
          "text-sm font-mono font-medium tabular-nums transition-colors",
          isLowTime ? "text-destructive" : "text-muted-foreground"
        )}
      >
        {String(minutes).padStart(2, "0")}:{String(remainingSeconds).padStart(2, "0")}
      </span>
    </div>
  );
}
