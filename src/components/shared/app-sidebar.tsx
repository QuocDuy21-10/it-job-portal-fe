"use client";

import type { ReactNode } from "react";
import { PanelLeftClose, PanelLeftOpen, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { toAppHref, type StaticHref } from "@/i18n/hrefs";
import { AppTooltip } from "@/components/ui/tooltip";
import { BrandLogo } from "@/components/shared/brand-logo";

export interface SidebarNavItem {
  id: string;
  label: string;
  description?: string;
  icon: LucideIcon;
  href?: StaticHref;
  onClick?: () => void;
  isActive?: boolean;
  badge?: string | number;
}

export interface AppSidebarProps {
  items: SidebarNavItem[];
  isExpanded: boolean;
  onToggle: () => void;
  brandHref?: StaticHref | "";
  brandSubtitle?: string;
  footer?: ReactNode;
  /** Top offset class (e.g. "top-0" for Admin full-height, "top-16" below main Header) */
  topOffsetClassName?: string;
  /** Responsive visibility classes (e.g. "hidden lg:flex" or "hidden md:flex") */
  responsiveClassName?: string;
  /** Z-index layer class */
  zIndexClassName?: string;
  collapseLabel: string;
  expandLabel: string;
  collapseAriaLabel?: string;
  expandAriaLabel?: string;
  toggleShortcut?: string;
  ariaLabel?: string;
  className?: string;
}

/**
 * Shared collapsible sidebar used by both Admin Dashboard and Profile pages.
 * Displays icon-only DevLink mark when collapsed and full DevLink branding when expanded,
 * with project-token tooltips on toggle and collapsed navigation items.
 */
export function AppSidebar({
  items,
  isExpanded,
  onToggle,
  brandHref = "/",
  brandSubtitle,
  footer,
  topOffsetClassName = "top-0",
  responsiveClassName = "hidden lg:flex",
  zIndexClassName = "z-30",
  collapseLabel,
  expandLabel,
  collapseAriaLabel,
  expandAriaLabel,
  toggleShortcut = "⌘B",
  ariaLabel,
  className,
}: AppSidebarProps) {
  const toggleTooltip = isExpanded ? collapseLabel : expandLabel;
  const toggleAria = isExpanded
    ? collapseAriaLabel || collapseLabel
    : expandAriaLabel || expandLabel;

  return (
    <aside
      aria-label={ariaLabel}
      className={cn(
        responsiveClassName,
        "fixed bottom-0 left-0 flex-col border-r border-border bg-card text-card-foreground",
        "transition-[width] duration-300 ease-in-out shadow-sm",
        topOffsetClassName,
        zIndexClassName,
        isExpanded ? "w-64" : "w-16",
        className
      )}
    >
      {/* Sidebar Header: BrandLogo + Toggle Button */}
      <div
        className={cn(
          "shrink-0 border-b border-border transition-all duration-300",
          isExpanded
            ? "flex h-16 items-center justify-between px-4"
            : "flex flex-col items-center justify-center gap-2 px-2 py-3"
        )}
      >
        <BrandLogo
          collapsed={!isExpanded}
          href={brandHref}
          subtitle={brandSubtitle}
        />

        <AppTooltip
          content={toggleTooltip}
          shortcut={toggleShortcut}
          side="right"
        >
          <button
            type="button"
            onClick={onToggle}
            aria-label={toggleAria}
            aria-expanded={isExpanded}
            className={cn(
              "inline-flex items-center justify-center rounded-lg p-1.5",
              "text-muted-foreground transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              !isExpanded && "h-9 w-9"
            )}
          >
            {isExpanded ? (
              <PanelLeftClose className="h-5 w-5" aria-hidden="true" />
            ) : (
              <PanelLeftOpen className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </AppTooltip>
      </div>

      {/* Navigation Links / Tabs */}
      <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <nav
          className={cn(
            "flex-1 space-y-1 py-3 transition-all duration-300",
            isExpanded ? "px-3" : "px-2"
          )}
        >
          {items.map((item) => {
            const Icon = item.icon;
            const showBadge =
              item.badge !== undefined && item.badge !== 0 && item.badge !== "";

            const itemClasses = cn(
              "group relative flex items-center rounded-lg text-sm font-medium transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isExpanded
                ? "w-full gap-3 px-3 py-2.5"
                : "mx-auto h-10 w-10 justify-center",
              item.isActive
                ? "bg-primary-subtle text-primary font-semibold dark:bg-primary/15 dark:text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            );

            const iconElement = (
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-colors",
                  item.isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
                aria-hidden="true"
              />
            );

            const innerContent = (
              <>
                {item.isActive && isExpanded && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-primary"
                  />
                )}
                {iconElement}
                {isExpanded && (
                  <span className="flex-1 truncate text-left">
                    {item.label}
                  </span>
                )}
                {isExpanded && showBadge && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    {typeof item.badge === "number" && item.badge > 99
                      ? "99+"
                      : item.badge}
                  </span>
                )}
              </>
            );

            const triggerNode = item.href ? (
              <Link
                key={item.id}
                href={toAppHref(item.href)}
                aria-current={item.isActive ? "page" : undefined}
                className={itemClasses}
              >
                {innerContent}
              </Link>
            ) : (
              <button
                key={item.id}
                type="button"
                onClick={item.onClick}
                aria-current={item.isActive ? "page" : undefined}
                className={itemClasses}
              >
                {innerContent}
              </button>
            );

            return (
              <AppTooltip
                key={item.id}
                content={item.label}
                description={item.description}
                side="right"
                disabled={isExpanded}
              >
                {triggerNode}
              </AppTooltip>
            );
          })}
        </nav>

        {/* Optional Footer Slot */}
        {footer && (
          <div
            className={cn(
              "shrink-0 border-t border-border py-3 transition-all duration-300",
              isExpanded ? "px-3" : "flex justify-center px-2"
            )}
          >
            {footer}
          </div>
        )}
      </div>
    </aside>
  );
}
