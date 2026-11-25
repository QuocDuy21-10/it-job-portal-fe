"use client";

import { format } from "date-fns";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";
import type { Translate } from "@/shared/types/i18n";
import { parseDateRange } from "./list-params";
import type { FilterField } from "./types";

const MAX_NAMES = 2;

type Props = {
  fields: FilterField[];
  filters: Record<string, string>;
  onChange: (filters: Record<string, string>) => void;
  onClear: () => void;
};

export function FilterChips({ fields, filters, onChange, onClear }: Props) {
  const { t } = useI18n();
  const active = fields.filter(({ key }) => filters[key]);
  if (active.length === 0) return null;

  const remove = (key: string) => {
    const { [key]: _removed, ...rest } = filters;
    onChange(rest);
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto px-4 pb-3 md:flex-wrap md:overflow-visible">
      {active.map((field) => (
        <span
          key={field.key}
          className="inline-flex h-8 shrink-0 items-center rounded-full border border-primary/30 bg-primary-subtle pl-3 text-sm text-primary"
        >
          {field.type === "entity" ? (
            <EntityText field={field} value={filters[field.key]} />
          ) : (
            `${field.label}: ${describe(field, filters[field.key], t)}`
          )}
          <button
            type="button"
            aria-label={t("adminPages.filters.remove", { label: field.label })}
            onClick={() => remove(field.key)}
            // The pseudo-element makes the touch target 44px without a taller chip.
            className="relative flex h-8 w-8 items-center justify-center rounded-full hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring after:absolute after:-inset-y-1.5 after:inset-x-0 after:content-[''] md:after:hidden"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </span>
      ))}
      <Button
        type="button"
        variant="ghost"
        className="h-11 shrink-0 px-3 md:h-8"
        onClick={onClear}
      >
        {t("adminPages.filters.clearAll")}
      </Button>
    </div>
  );
}

function EntityText({
  field,
  value,
}: {
  field: Extract<FilterField, { type: "entity" }>;
  value: string;
}) {
  const { selectedLabel } = field.useOptions("", value);
  return <>{`${field.label}: ${selectedLabel ?? "…"}`}</>;
}

function describe(
  field: Exclude<FilterField, { type: "entity" }>,
  value: string,
  t: Translate
): string {
  if (field.type === "date") {
    if (value === "7d") return t("adminPages.filters.last7Days");
    if (value === "30d") return t("adminPages.filters.last30Days");
    const { from, to } = parseDateRange(value) ?? {};
    const day = (date: Date) => format(date, "dd/MM/yyyy");
    if (from && to) return `${day(from)} – ${day(to)}`;
    if (from) return t("adminPages.filters.fromDate", { date: day(from) });
    return to ? t("adminPages.filters.toDate", { date: day(to) }) : "";
  }

  const labels = value
    .split(",")
    .map(
      (item) =>
        field.options.find((option) => option.value === item)?.label ?? item
    );
  const rest = labels.length - MAX_NAMES;
  return labels.slice(0, MAX_NAMES).join(", ") + (rest > 0 ? ` +${rest}` : "");
}
