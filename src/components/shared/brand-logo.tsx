"use client";

import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { toAppHref, type StaticHref } from "@/i18n/hrefs";

export interface BrandLogoProps {
  /** When true, only the DevLink icon mark is displayed */
  collapsed?: boolean;
  /** Optional navigation target (defaults to "/"; pass "" or undefined to disable link) */
  href?: StaticHref | "";
  /** Optional context subtitle shown below the wordmark when expanded */
  subtitle?: string;
  className?: string;
}

/**
 * DevLink brand mark + wordmark.
 * Collapsed state renders the double-ring infinity icon only; expanded state adds "DevLink".
 */
export function BrandLogo({
  collapsed = false,
  href = "/",
  subtitle,
  className,
}: BrandLogoProps) {
  const content = (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 select-none",
        collapsed && "justify-center",
        className
      )}
    >
      {/* Double-ring link mark matching DevLink brand colors */}
      <svg
        viewBox="0 0 36 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-9 shrink-0"
        aria-hidden="true"
      >
        <circle
          cx="12.5"
          cy="12"
          r="8.5"
          className="stroke-primary"
          strokeWidth="3.2"
        />
        <circle
          cx="23.5"
          cy="12"
          r="8.5"
          className="stroke-brand-secondary"
          strokeWidth="3.2"
        />
      </svg>

      {!collapsed && (
        <span className="flex flex-col leading-none">
          <span className="text-lg font-bold tracking-tight">
            <span className="text-primary">Dev</span>
            <span className="text-brand-secondary">Link</span>
          </span>
          {subtitle && (
            <span className="mt-0.5 text-[11px] font-medium text-muted-foreground">
              {subtitle}
            </span>
          )}
        </span>
      )}
    </span>
  );

  if (!href) {
    return content;
  }

  return (
    <Link
      href={toAppHref(href)}
      aria-label="DevLink"
      className="inline-flex items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {content}
    </Link>
  );
}
