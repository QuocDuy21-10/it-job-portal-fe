"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipPortal = TooltipPrimitive.Portal;

const TooltipArrow = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Arrow>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow>
>(({ className, ...props }, ref) => (
  <TooltipPrimitive.Arrow
    ref={ref}
    className={cn("fill-foreground", className)}
    width={10}
    height={5}
    {...props}
  />
));
TooltipArrow.displayName = TooltipPrimitive.Arrow.displayName;

export interface TooltipContentProps extends React.ComponentPropsWithoutRef<
  typeof TooltipPrimitive.Content
> {
  variant?: "default" | "surface";
  showArrow?: boolean;
}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(
  (
    {
      className,
      sideOffset = 8,
      variant = "default",
      showArrow = false,
      children,
      ...props
    },
    ref
  ) => (
    <TooltipPortal>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          "z-tooltip overflow-hidden rounded-lg px-3 py-1.5 text-xs font-medium shadow-lg",
          "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          variant === "default"
            ? "bg-foreground text-background"
            : "border border-border bg-popover text-popover-foreground",
          className
        )}
        {...props}
      >
        {children}
        {showArrow && (
          <TooltipArrow
            className={
              variant === "surface" ? "fill-popover" : "fill-foreground"
            }
          />
        )}
      </TooltipPrimitive.Content>
    </TooltipPortal>
  )
);
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export interface AppTooltipProps {
  /** Primary tooltip label */
  content: React.ReactNode;
  /** Optional secondary description line */
  description?: React.ReactNode;
  /** Optional keyboard shortcut badge (e.g. "⌘B") */
  shortcut?: string;
  /** Placement relative to trigger */
  side?: "top" | "right" | "bottom" | "left";
  /** Alignment along the side */
  align?: "start" | "center" | "end";
  /** Distance from trigger in px */
  sideOffset?: number;
  /** Visual variant using project tokens */
  variant?: "default" | "surface";
  /** Show pointing arrow */
  showArrow?: boolean;
  /** When true, renders children directly without tooltip overhead */
  disabled?: boolean;
  /** Custom delay in ms (inherits TooltipProvider default when omitted) */
  delayDuration?: number;
  className?: string;
  children: React.ReactNode;
}

/**
 * Reusable production tooltip built on @radix-ui/react-tooltip and project color tokens.
 */
function AppTooltip({
  content,
  description,
  shortcut,
  side = "top",
  align = "center",
  sideOffset = 8,
  variant = "default",
  showArrow = true,
  disabled = false,
  delayDuration,
  className,
  children,
}: AppTooltipProps) {
  if (disabled || !content) {
    return <>{children}</>;
  }

  return (
    <Tooltip delayDuration={delayDuration}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        variant={variant}
        showArrow={showArrow}
        className={cn("max-w-xs", className)}
      >
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="font-medium leading-tight">{content}</span>
            {shortcut && (
              <kbd
                className={cn(
                  "inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold leading-none",
                  variant === "default"
                    ? "bg-background/15 text-background"
                    : "border border-border bg-muted text-muted-foreground"
                )}
              >
                {shortcut}
              </kbd>
            )}
          </div>
          {description && (
            <p
              className={cn(
                "text-[11px] font-normal leading-snug",
                variant === "default"
                  ? "text-background/75"
                  : "text-muted-foreground"
              )}
            >
              {description}
            </p>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export {
  AppTooltip,
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
};
