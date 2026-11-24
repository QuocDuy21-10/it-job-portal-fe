"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/hooks/use-i18n";
import { useGetJobSourcesQuery } from "../redux/crawl.api";

// Radix Select forbids an empty item value.
const ALL = "all";

type SourceFilterProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SourceFilter({ value, onChange }: SourceFilterProps) {
  const { t } = useI18n();
  const { data } = useGetJobSourcesQuery();

  return (
    <Select
      value={value || ALL}
      onValueChange={(next) => onChange(next === ALL ? "" : next)}
    >
      <SelectTrigger
        className="w-full md:w-56"
        aria-label={t("adminPages.crawl.sources.source")}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>{t("adminPages.crawl.allSources")}</SelectItem>
        {(data?.data ?? []).map((source) => (
          <SelectItem key={source.key} value={source.key}>
            {source.key}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
