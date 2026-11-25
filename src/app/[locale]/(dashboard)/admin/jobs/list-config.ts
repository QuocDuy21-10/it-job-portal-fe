import { addDays, endOfDay, startOfDay } from "date-fns";
import { dateFilter } from "@/components/admin/list/list-params";
import type {
  ListConfig,
  ListValues,
  Option,
} from "@/components/admin/list/types";
import { useCompanySearchOptions } from "@/features/company/hooks/use-company-search-options";
import {
  JOB_TYPE_LABEL_KEYS,
  getTranslatedLabel,
} from "@/features/job/config/job-labels";
import { between, equals } from "@/lib/utils/list-url";
import { LOCATION_OPTIONS } from "@/shared/data/location-catalog";
import jobLevels from "@/shared/data/job-level.json";
import jobTypes from "@/shared/data/job-type.json";
import type { Translate } from "@/shared/types/i18n";
import type { PaginatedQueryParams } from "@/shared/types/pagination";

const STATES = ["PENDING", "ACTIVE", "PAUSED", "REJECTED", "EXPIRED"];

// Whole VND, so an upper bound is one below the next range.
const SALARIES: Record<string, { key: string; min?: number; max?: number }> = {
  lt10: { key: "under10m", max: 9_999_999 },
  "10-20": { key: "tenTo20m", min: 10_000_000, max: 19_999_999 },
  "20-50": { key: "twentyTo50m", min: 20_000_000, max: 49_999_999 },
  gte50: { key: "above50m", min: 50_000_000 },
};

const withoutAll = ({ value }: { value: string }) => value !== "all";

export function buildJobListConfig(
  t: Translate,
  { isAdmin, skillOptions }: { isAdmin: boolean; skillOptions: Option[] }
): ListConfig {
  const label = (key: string) => t(`adminPages.jobs.filters.${key}`);

  return {
    tabs: [
      { value: "", label: t("adminPages.jobs.tabs.all") },
      ...STATES.map((value) => ({
        value,
        label: t(`adminPages.jobs.tabs.${value}`),
        tone: value === "PENDING" ? ("warning" as const) : undefined,
      })),
    ],
    fields: [
      {
        key: "level",
        label: label("level"),
        type: "multi",
        options: jobLevels.filter(withoutAll).map(({ value }) => ({
          value,
          label: t(`adminPages.jobs.levels.${value.toLowerCase()}`),
        })),
      },
      {
        key: "formOfWork",
        label: label("formOfWork"),
        type: "multi",
        options: jobTypes.filter(withoutAll).map(({ value }) => ({
          value,
          label: getTranslatedLabel(value, JOB_TYPE_LABEL_KEYS, t),
        })),
      },
      {
        key: "location",
        label: t("adminPages.filters.location"),
        type: "multi",
        options: LOCATION_OPTIONS,
      },
      {
        key: "skills",
        label: label("skills"),
        type: "multi",
        options: skillOptions,
      },
      ...(isAdmin
        ? [
            {
              key: "company",
              label: t("adminPages.filters.company"),
              type: "entity" as const,
              useOptions: useCompanySearchOptions,
            },
          ]
        : []),
      {
        key: "salary",
        label: label("salary"),
        type: "select",
        options: Object.entries(SALARIES).map(([value, { key }]) => ({
          value,
          label: t(`adminPages.jobs.salaryRanges.${key}`),
        })),
      },
      {
        key: "created",
        label: t("adminPages.filters.createdAt"),
        type: "date",
      },
      {
        key: "expiring",
        label: label("expiring"),
        type: "select",
        options: ["7", "30"].map((value) => ({
          value,
          label: label(`expiring${value}`),
        })),
      },
    ],
    sorts: [
      { value: "-createdAt", label: t("adminPages.filters.newest") },
      { value: "createdAt", label: t("adminPages.filters.oldest") },
      { value: "-salary", label: label("salaryHigh") },
      { value: "salary", label: label("salaryLow") },
      { value: "endDate", label: label("deadline") },
    ],
    defaultPageSize: 10,
  };
}

export function toJobQuery({
  q,
  tab,
  sort,
  page,
  limit,
  filters,
}: ListValues): PaginatedQueryParams {
  const salary = SALARIES[filters.salary];
  const today = new Date();

  return {
    page,
    limit,
    sort: `sort=${sort}`,
    keyword: q,
    state: tab,
    filter: [
      ...equals("locationCode", filters.location),
      ...equals("level", filters.level),
      ...equals("formOfWork", filters.formOfWork),
      ...equals("skills", filters.skills),
      ...equals("company._id", filters.company),
      ...between("salary", salary?.min, salary?.max),
      ...dateFilter("createdAt", filters.created),
      ...(filters.expiring
        ? between(
            "endDate",
            startOfDay(today).toISOString(),
            endOfDay(addDays(today, Number(filters.expiring))).toISOString()
          )
        : []),
    ].join("&"),
  };
}
