"use client";

import { useId, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetOverlay,
  SheetPortal,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useDebounce } from "@/hooks/use-debounce";
import { useI18n } from "@/hooks/use-i18n";
import { useMediaQuery } from "@/hooks/use-media-query";
import { FilterField } from "./filter-field";
import type { ListConfig, ListValues, UseListTotal } from "./types";

type Draft = Pick<ListValues, "filters" | "sort">;

type Props = {
  config: ListConfig;
  values: ListValues;
  total?: number;
  onApply: (patch: Draft) => void;
  useTotal: UseListTotal;
};

// An open list inside the panel closes first (same rule as AdminDrawer).
const keepOpenForInnerList = (event: KeyboardEvent) => {
  if (document.activeElement?.closest("[data-escape-scope]")) {
    event.preventDefault();
  }
};

export function AdminFilterPanel(props: Props) {
  const { config, values } = props;
  const { t } = useI18n();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isOpen, setIsOpen] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleId = useId();
  const count = config.fields.filter(({ key }) => values.filters[key]).length;

  const focusTitle = (event: Event) => {
    event.preventDefault();
    titleRef.current?.focus();
  };
  const title = (
    <h2
      ref={titleRef}
      id={titleId}
      tabIndex={-1}
      className="font-heading text-h4 text-foreground outline-none"
    >
      {t("adminPages.filters.button")}
    </h2>
  );
  const trigger = (
    <Button
      type="button"
      variant="outline"
      className="h-11 shrink-0 gap-2 md:h-9"
      aria-label={
        count > 0 ? t("adminPages.filters.buttonActive", { count }) : undefined
      }
    >
      <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
      {t("adminPages.filters.button")}
      {count > 0 && (
        <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold tabular-nums text-primary-foreground">
          {count}
        </span>
      )}
    </Button>
  );
  // Mounted only while open, so each opening starts from the applied filters.
  const body = (
    <PanelBody
      {...props}
      showSort={!isDesktop}
      onDone={() => setIsOpen(false)}
    />
  );

  if (isDesktop) {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent
          align="start"
          collisionPadding={16}
          aria-labelledby={titleId}
          onOpenAutoFocus={focusTitle}
          onEscapeKeyDown={keepOpenForInnerList}
          className="flex max-h-[--radix-popover-content-available-height] w-[640px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-lg p-0 shadow-elevation-2"
        >
          <header className="shrink-0 border-b border-border px-4 py-3">
            {title}
          </header>
          {body}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetPortal>
        <SheetOverlay className="duration-slow" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          onOpenAutoFocus={focusTitle}
          onEscapeKeyDown={keepOpenForInnerList}
          className="fixed inset-x-0 bottom-0 z-modal flex max-h-[90dvh] flex-col overflow-hidden rounded-t-xl bg-card shadow-elevation-3 outline-none duration-slow ease-standard data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom"
        >
          <div
            className="mx-auto mt-2 h-1 w-8 shrink-0 rounded-full bg-border"
            aria-hidden="true"
          />
          <header className="flex shrink-0 items-center justify-between border-b border-border py-1 pl-4 pr-2">
            <DialogPrimitive.Title asChild>{title}</DialogPrimitive.Title>
            <DialogPrimitive.Close asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-11 w-11"
                aria-label={t("common.close")}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </Button>
            </DialogPrimitive.Close>
          </header>
          {body}
        </DialogPrimitive.Content>
      </SheetPortal>
    </Sheet>
  );
}

function PanelBody({
  config,
  values,
  total,
  onApply,
  useTotal,
  showSort,
  onDone,
}: Props & { showSort: boolean; onDone: () => void }) {
  const { t } = useI18n();
  // The page parses `values` from the URL on every render: keep the object this panel opened with.
  const [applied] = useState(values);
  const [draft, setDraft] = useState<Draft>({
    filters: applied.filters,
    sort: applied.sort,
  });
  // Remounts the fields, whose own state (custom date, search) must reset too.
  const [resets, setResets] = useState(0);
  const settled = useDebounce(draft.filters, 300);
  const draftTotal = useTotal(
    { ...applied, filters: settled },
    settled === applied.filters
  );
  const shown =
    draft.filters === applied.filters
      ? total
      : settled === draft.filters
        ? draftTotal
        : undefined;

  const setFilter = (key: string, value: string) =>
    setDraft((current) => {
      const { [key]: _removed, ...filters } = current.filters;
      return {
        ...current,
        filters: value ? { ...filters, [key]: value } : filters,
      };
    });

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
        <div
          key={resets}
          className="grid grid-cols-1 items-start gap-4 md:grid-cols-2"
        >
          {showSort && config.sorts.length > 1 && (
            <FilterField
              field={{
                key: "sort",
                label: t("adminPages.filters.sort"),
                type: "select",
                options: config.sorts.slice(1),
                emptyLabel: config.sorts[0].label,
              }}
              value={draft.sort === config.sorts[0].value ? "" : draft.sort}
              onChange={(sort) =>
                setDraft((current) => ({
                  ...current,
                  sort: sort || config.sorts[0].value,
                }))
              }
            />
          )}
          {config.fields.map((field) => (
            <FilterField
              key={field.key}
              field={field}
              value={draft.filters[field.key] ?? ""}
              onChange={(value) => setFilter(field.key, value)}
            />
          ))}
        </div>
      </div>
      <footer className="flex shrink-0 gap-2 border-t border-border p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:justify-end">
        <Button
          type="button"
          variant="outline"
          className="h-11 md:h-10"
          onClick={() => {
            setDraft((current) => ({ ...current, filters: {} }));
            setResets((current) => current + 1);
          }}
        >
          {t("adminPages.filters.clear")}
        </Button>
        <Button
          type="button"
          className="h-11 min-w-[10rem] flex-1 tabular-nums md:h-10 md:flex-none"
          onClick={() => {
            onApply(draft);
            onDone();
          }}
        >
          {shown === undefined
            ? t("adminPages.filters.show")
            : t("adminPages.filters.showCount", { count: shown })}
        </Button>
      </footer>
    </>
  );
}
