"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { CircleAlert } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import { FilterChips } from "./filter-chips";
import { AdminFilterPanel } from "./filter-panel";
import type { ListConfig, ListTab, ListValues, UseListTotal } from "./types";

// The API's key for the All tab, also used where an empty value is awkward.
const ALL = "ALL";

type AdminListProps = {
  config: ListConfig;
  values: ListValues;
  onChange: (patch: Partial<ListValues>) => void;
  onClear: () => void;
  useTotal: UseListTotal;
  searchPlaceholder?: string;
  counts?: Record<string, number>;
  total?: number;
  isFetching?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  hideToolbar?: boolean;
  children: ReactNode;
};

/** One card: status tabs, search, filters, chips, and the page's own table. */
export function AdminList(props: AdminListProps) {
  const { config, values, onChange, hideToolbar, total, isFetching } = props;
  const card = "rounded-lg border border-border bg-card";

  // Rows deleted from the last page, or an old link: the page may be gone.
  const lastPage = Math.max(1, Math.ceil((total ?? 0) / values.limit));
  const isPastEnd =
    total !== undefined && !isFetching && values.page > lastPage;
  useEffect(() => {
    if (isPastEnd) onChange({ page: lastPage });
    // onChange is a new function on each render; it reads the live URL.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPastEnd, lastPage]);

  if (hideToolbar) {
    return (
      <section data-admin-list="" className={card}>
        <ListBody {...props} />
      </section>
    );
  }
  if (!config.tabs) {
    return (
      <section data-admin-list="" className={card}>
        <Toolbar {...props} />
        <ListBody {...props} />
      </section>
    );
  }

  const tab = values.tab || ALL;
  return (
    <TabsPrimitive.Root
      value={tab}
      // Arrow keys only move focus: selecting sends a request.
      activationMode="manual"
      onValueChange={(next) => onChange({ tab: next === ALL ? "" : next })}
      data-admin-list=""
      className={card}
    >
      <StatusTabs tabs={config.tabs} active={tab} counts={props.counts} />
      <Toolbar {...props} />
      <TabsPrimitive.Content
        value={tab}
        className="outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        <ListBody {...props} />
      </TabsPrimitive.Content>
    </TabsPrimitive.Root>
  );
}

function StatusTabs({
  tabs,
  active,
  counts,
}: {
  tabs: ListTab[];
  active: string;
  counts?: Record<string, number>;
}) {
  const { t } = useI18n();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current
      ?.querySelector('[data-state="active"]')
      ?.scrollIntoView?.({ block: "nearest", inline: "center" });
  }, [active]);

  return (
    <TabsPrimitive.List
      ref={listRef}
      aria-label={t("adminPages.filters.tabsLabel")}
      className="flex gap-1 overflow-x-auto border-b border-border px-2 pr-6 [mask-image:linear-gradient(to_right,black_calc(100%-24px),transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {tabs.map(({ value, label, tone }) => {
        const count = counts?.[value || ALL];
        return (
          <TabsPrimitive.Trigger
            key={value || ALL}
            value={value || ALL}
            className="flex h-12 shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring data-[state=active]:border-primary data-[state=active]:text-link"
          >
            {label}
            {counts && (
              <span
                className={cn(
                  "min-w-[2rem] rounded-full px-2 py-0.5 text-center text-xs tabular-nums",
                  tone === "warning" && count
                    ? "bg-warning-bg text-warning"
                    : "bg-muted text-muted-foreground",
                  // Not loaded yet, or failed: keep the space so tabs do not move.
                  count === undefined && "invisible"
                )}
              >
                {count}
              </span>
            )}
          </TabsPrimitive.Trigger>
        );
      })}
    </TabsPrimitive.List>
  );
}

function Toolbar({
  config,
  values,
  onChange,
  onClear,
  useTotal,
  searchPlaceholder,
  total,
}: AdminListProps) {
  const { t } = useI18n();
  const sortId = useId();

  return (
    <>
      <div className="flex items-center gap-2 p-4 py-3">
        {searchPlaceholder && (
          <SearchBar
            value={values.q}
            onSearch={(q) => onChange({ q })}
            placeholder={searchPlaceholder}
            className="min-w-0 flex-1 md:max-w-xs"
          />
        )}
        {config.fields.length > 0 && (
          <AdminFilterPanel
            config={config}
            values={values}
            total={total}
            onApply={onChange}
            useTotal={useTotal}
          />
        )}
        {config.sorts.length > 1 && (
          <div className="ml-auto hidden items-center gap-2 md:flex">
            <label
              htmlFor={sortId}
              className="whitespace-nowrap text-sm text-muted-foreground"
            >
              {t("adminPages.filters.sort")}
            </label>
            <Select
              value={values.sort}
              onValueChange={(sort) => onChange({ sort })}
            >
              <SelectTrigger id={sortId} className="h-9 w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {config.sorts.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      <FilterChips
        fields={config.fields}
        filters={values.filters}
        onChange={(filters) => onChange({ filters })}
        onClear={onClear}
      />
      <p role="status" className="sr-only">
        {total !== undefined &&
          t("adminPages.filters.resultCount", { count: total })}
      </p>
    </>
  );
}

function ListBody({ isFetching, isError, onRetry, children }: AdminListProps) {
  const { t } = useI18n();

  if (isError) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <CircleAlert className="h-4 w-4" aria-hidden="true" />
          <AlertDescription className="flex flex-wrap items-center justify-between gap-2">
            {t("adminPages.filters.loadError")}
            <Button
              type="button"
              variant="outline"
              className="h-11 md:h-9"
              onClick={onRetry}
            >
              {t("adminPages.filters.retry")}
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div
      aria-busy={isFetching}
      className={cn(
        "overflow-hidden rounded-b-lg border-t border-border transition-opacity",
        isFetching && "opacity-60"
      )}
    >
      {children}
    </div>
  );
}
