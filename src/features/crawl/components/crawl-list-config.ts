import { parseDateRange } from "@/components/admin/list/list-params";
import type {
  FilterField,
  ListConfig,
  ListValues,
  Option,
} from "@/components/admin/list/types";
import type { Translate } from "@/shared/types/i18n";
import { useGetJobSourcesQuery } from "../redux/crawl.api";
import {
  CRAWLED_JOB_STATES,
  ERROR_REASONS,
  type CrawlFailuresParams,
  type CrawledJobState,
  type CrawledJobsParams,
  type RejectionReason,
} from "../schemas/crawl.schema";

const PAGE_SIZE = 20;

export function useSourceOptions(): Option[] {
  const { data } = useGetJobSourcesQuery();
  return (data?.data ?? []).map(({ key }) => ({ value: key, label: key }));
}

const sourceField = (t: Translate, options: Option[]): FilterField => ({
  key: "source",
  label: t("adminPages.crawl.sources.source"),
  type: "select",
  options,
});

const isoRange = (value = "") => {
  const range = parseDateRange(value);
  return { from: range?.from?.toISOString(), to: range?.to?.toISOString() };
};

export function buildCrawledJobsConfig(
  t: Translate,
  sources: Option[]
): ListConfig {
  return {
    tabs: [
      { value: "", label: t("adminPages.crawl.jobs.allTab") },
      ...CRAWLED_JOB_STATES.map((value) => ({
        value,
        label: t(`adminPages.crawl.jobs.states.${value}`),
      })),
    ],
    fields: [
      sourceField(t, sources),
      {
        key: "crawled",
        label: t("adminPages.crawl.jobs.crawledAt"),
        type: "date",
      },
    ],
    sorts: [],
    defaultPageSize: PAGE_SIZE,
  };
}

export function toCrawledJobsParams({
  q,
  tab,
  page,
  limit,
  filters,
}: ListValues): CrawledJobsParams {
  return {
    page,
    limit,
    keyword: q,
    // parseListParams only lets known tabs through.
    state: (tab || undefined) as CrawledJobState | undefined,
    sourceKey: filters.source,
    ...isoRange(filters.crawled),
  };
}

export function buildFailuresConfig(
  t: Translate,
  sources: Option[],
  group: string
): ListConfig {
  return {
    tabs: ["error", "filtered"].map((value) => ({
      value,
      label: t(`adminPages.crawl.failures.${value}`),
    })),
    fields: [
      sourceField(t, sources),
      ...(group === "filtered"
        ? []
        : [
            {
              key: "reason",
              label: t("adminPages.crawl.failures.reason"),
              type: "select" as const,
              options: ERROR_REASONS.map((value) => ({
                value,
                label: t(`adminPages.crawl.failures.reasons.${value}`),
              })),
            },
          ]),
      {
        key: "failed",
        label: t("adminPages.crawl.failures.failedAt"),
        type: "date",
      },
    ],
    sorts: [],
    defaultPageSize: PAGE_SIZE,
  };
}

export function toFailuresParams({
  tab,
  page,
  limit,
  filters,
}: ListValues): CrawlFailuresParams {
  const group = tab === "filtered" ? "filtered" : "error";

  return {
    page,
    limit,
    group,
    sourceKey: filters.source,
    reason:
      group === "error"
        ? (filters.reason as RejectionReason | undefined)
        : undefined,
    ...isoRange(filters.failed),
  };
}
