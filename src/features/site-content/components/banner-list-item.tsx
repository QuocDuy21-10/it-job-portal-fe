"use client";

import Image from "next/image";
import {
  ArrowDown,
  ArrowUp,
  CalendarX,
  CheckCircle2,
  Clock,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import { formatLocaleDate } from "@/lib/utils/locale-formatters";
import { toPickerDay } from "../lib/banner-form";
import type { Banner, BannerStatus } from "../schemas/site-content.schema";

const STATUS: Record<BannerStatus, { icon: typeof Clock; className: string }> =
  {
    live: { icon: CheckCircle2, className: "bg-success-bg text-success" },
    scheduled: { icon: Clock, className: "bg-info-bg text-info" },
    hidden: { icon: EyeOff, className: "bg-muted text-muted-foreground" },
    ended: { icon: CalendarX, className: "bg-warning-bg text-warning" },
  };

type BannerListItemProps = {
  banner: Banner;
  isFirst: boolean;
  isLast: boolean;
  canShow: boolean;
  busy: boolean;
  onToggle: () => void;
  onMove: (direction: -1 | 1) => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function BannerListItem({
  banner,
  isFirst,
  isLast,
  canShow,
  busy,
  onToggle,
  onMove,
  onEdit,
  onDelete,
}: BannerListItemProps) {
  const { t, language } = useI18n();
  const text = (key: string, values?: Record<string, string>) =>
    t(`adminPages.siteContent.banner.${key}`, values);
  const status = STATUS[banner.status];
  const StatusIcon = status.icon;
  const day = (iso: string, addDays = 0) =>
    formatLocaleDate(toPickerDay(iso, addDays), language, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  const schedule =
    banner.startAt || banner.endAt
      ? `${banner.startAt ? day(banner.startAt) : "…"} – ${banner.endAt ? day(banner.endAt, -1) : "…"}`
      : text("noLimit");
  const showDisabled = !banner.isActive && !canShow;

  const toggle = (
    <Button
      variant="outline"
      size="sm"
      disabled={busy || showDisabled}
      onClick={onToggle}
    >
      {text(banner.isActive ? "hide" : "show")}
    </Button>
  );

  return (
    <li className="flex flex-col gap-3 rounded-lg border border-border p-3 md:flex-row md:items-center">
      <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-md bg-muted md:w-40">
        <Image
          src={banner.imageUrl}
          alt=""
          fill
          sizes="(min-width: 768px) 160px, 100vw"
          className="object-cover"
        />
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <p className="truncate font-medium">{banner.name}</p>
        <p className="truncate text-sm text-muted-foreground">
          {banner.content?.vi.title ?? text("imageOnly")}
        </p>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium",
              status.className
            )}
          >
            <StatusIcon className="h-3.5 w-3.5" aria-hidden="true" />
            {text(`status.${banner.status}`)}
          </span>
          <span className="text-muted-foreground">{schedule}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1">
        {showDisabled ? (
          <Tooltip>
            <TooltipTrigger asChild>
              {/* A disabled button gets no pointer events, so the span carries the tooltip. */}
              <span tabIndex={0}>{toggle}</span>
            </TooltipTrigger>
            <TooltipContent>{text("capReached")}</TooltipContent>
          </Tooltip>
        ) : (
          toggle
        )}
        <Button
          variant="ghost"
          size="icon"
          disabled={busy || isFirst}
          aria-label={text("moveUp", { name: banner.name })}
          onClick={() => onMove(-1)}
        >
          <ArrowUp className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          disabled={busy || isLast}
          aria-label={text("moveDown", { name: banner.name })}
          onClick={() => onMove(1)}
        >
          <ArrowDown className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button variant="ghost" size="sm" disabled={busy} onClick={onEdit}>
          {text("edit")}
        </Button>
        <Button variant="ghost" size="sm" disabled={busy} onClick={onDelete}>
          {t("adminPages.shared.delete")}
        </Button>
      </div>
    </li>
  );
}
