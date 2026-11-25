"use client";

import { useId, useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import { Combobox } from "@/components/combo-box";
import { DatePicker } from "@/components/date-picker";
import { MultiSelect } from "@/components/multi-select";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/hooks/use-i18n";
import { toDateOnly } from "@/lib/utils/locale-formatters";
import { parseDateRange } from "./list-params";
import type { FilterField as Field, Option } from "./types";

// Radix Select forbids an empty item value.
const ALL = "all";
const MAX_TOGGLES = 8;

type Props = {
  field: Field;
  value: string;
  onChange: (value: string) => void;
};

export function FilterField({ field, value, onChange }: Props) {
  const { t } = useI18n();
  const id = useId();

  switch (field.type) {
    case "multi": {
      const selected = value ? value.split(",") : [];
      const { options } = field;
      if (options.length > 0 && options.length <= MAX_TOGGLES) {
        return (
          <Toggles
            label={field.label}
            options={options}
            isOn={(option) => selected.includes(option)}
            onToggle={(option) =>
              onChange(
                (selected.includes(option)
                  ? selected.filter((item) => item !== option)
                  : [...selected, option]
                ).join(",")
              )
            }
          />
        );
      }
      return (
        <Labelled id={id} label={field.label}>
          <MultiSelect
            id={id}
            aria-label={field.label}
            options={options}
            value={selected}
            onChange={(next) => onChange(next.join(","))}
            placeholder={t("adminPages.filters.choose")}
            searchPlaceholder={t("adminPages.filters.search")}
            emptyText={t("adminPages.filters.noOptions")}
          />
        </Labelled>
      );
    }
    case "select":
      return (
        <Labelled id={id} label={field.label}>
          <Select
            value={value || ALL}
            onValueChange={(next) => onChange(next === ALL ? "" : next)}
          >
            <SelectTrigger id={id} className="h-11 md:h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>
                {field.emptyLabel ?? t("adminPages.filters.all")}
              </SelectItem>
              {field.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Labelled>
      );
    case "date":
      return (
        <DateField label={field.label} value={value} onChange={onChange} />
      );
    case "entity":
      return (
        <EntityField id={id} field={field} value={value} onChange={onChange} />
      );
  }
}

function Labelled({
  id,
  label,
  action,
  children,
}: {
  id: string;
  label: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0 space-y-2">
      <div className="flex min-h-[1.5rem] items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
        {action}
      </div>
      {children}
    </div>
  );
}

function Toggles({
  label,
  options,
  isOn,
  onToggle,
}: {
  label: string;
  options: Option[];
  isOn: (value: string) => boolean;
  onToggle: (value: string) => void;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 min-h-[1.5rem] text-sm font-medium text-foreground">
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={isOn(option.value)}
            onClick={() => onToggle(option.value)}
            className="inline-flex h-11 items-center gap-1 rounded-full border border-input bg-background px-3 text-sm text-foreground transition-colors duration-fast hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 aria-pressed:border-primary aria-pressed:bg-primary-subtle aria-pressed:text-primary md:h-8"
          >
            {option.label}
            {isOn(option.value) && (
              <Check className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

const CUSTOM = "custom";

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const { t } = useI18n();
  const [isCustom, setIsCustom] = useState(value.includes(".."));
  const { from, to } = (isCustom && parseDateRange(value)) || {};

  const setRange = (nextFrom?: Date, nextTo?: Date) =>
    onChange(
      nextFrom || nextTo ? `${toDateOnly(nextFrom)}..${toDateOnly(nextTo)}` : ""
    );

  return (
    <div className="min-w-0 space-y-2">
      <Toggles
        label={label}
        options={[
          { value: "7d", label: t("adminPages.filters.last7Days") },
          { value: "30d", label: t("adminPages.filters.last30Days") },
          { value: CUSTOM, label: t("adminPages.filters.custom") },
        ]}
        isOn={(option) =>
          option === CUSTOM ? isCustom : !isCustom && option === value
        }
        onToggle={(option) => {
          setIsCustom(option === CUSTOM && !isCustom);
          onChange(option === CUSTOM || option === value ? "" : option);
        }}
      />
      {isCustom && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <DatePicker
            value={from}
            // A start after the end drops the end, so the range stays valid.
            onChange={(date) =>
              setRange(date, date && to && date > to ? undefined : to)
            }
            placeholder={t("adminPages.filters.from")}
            aria-label={`${label}: ${t("adminPages.filters.from")}`}
            className="h-11 md:h-10"
          />
          <DatePicker
            value={to}
            onChange={(date) =>
              setRange(date && from && from > date ? undefined : from, date)
            }
            placeholder={t("adminPages.filters.to")}
            aria-label={`${label}: ${t("adminPages.filters.to")}`}
            className="h-11 md:h-10"
          />
        </div>
      )}
    </div>
  );
}

function EntityField({
  id,
  field,
  value,
  onChange,
}: {
  id: string;
  field: Extract<Field, { type: "entity" }>;
  value: string;
  onChange: (value: string) => void;
}) {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const { options, selectedLabel, isFetching } = field.useOptions(
    search,
    value || undefined
  );
  const isListed = options.some((option) => option.value === value);

  return (
    <Labelled
      id={id}
      label={field.label}
      action={
        value && (
          <Button
            type="button"
            variant="link"
            className="h-6 p-0 text-sm"
            onClick={() => onChange("")}
          >
            {t("adminPages.filters.deselect")}
          </Button>
        )
      }
    >
      <Combobox
        id={id}
        options={
          value && !isListed
            ? [{ value, label: selectedLabel ?? value }, ...options]
            : options
        }
        value={value}
        onChange={onChange}
        onSearchChange={setSearch}
        isLoading={isFetching}
        loadingText={t("adminPages.filters.loading")}
        placeholder={t("adminPages.filters.choose")}
        searchPlaceholder={t("adminPages.filters.search")}
        emptyText={t("adminPages.filters.noOptions")}
        className="h-11 md:h-10"
      />
    </Labelled>
  );
}
