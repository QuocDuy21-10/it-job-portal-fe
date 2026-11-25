import { z } from "zod";
import type { Translate } from "@/shared/types/i18n";

export const DISPLAY_POLICIES = ["FULL", "LINK_ONLY", "HIDDEN"] as const;
export type DisplayPolicy = (typeof DISPLAY_POLICIES)[number];

export const CRAWLED_JOB_STATES = [
  "ACTIVE",
  "STALE",
  "CLOSED",
  "REMOVED",
] as const;
export type CrawledJobState = (typeof CRAWLED_JOB_STATES)[number];

export const ERROR_REASONS = [
  "FETCH_ERROR",
  "NOT_FOUND",
  "NO_STRUCTURED_DATA",
  "MISSING_FIELDS",
] as const;
export type RejectionReason = (typeof ERROR_REASONS)[number] | "NOT_IT";

export type SyncStatus =
  "RUNNING" | "SUCCESS" | "PARTIAL" | "SUSPECT" | "FAILED";

export type JobSource = {
  key: string;
  provider: "GREENHOUSE" | "LEVER" | "TOPDEV" | "ITVIEC";
  boardToken: string;
  companyName: string;
  enabled: boolean;
  displayPolicy?: DisplayPolicy;
  lastSyncedAt?: string;
  lastSyncStatus?: SyncStatus;
  lastSyncError?: string;
  counts: {
    total: number;
    active: number;
    stale: number;
    closed: number;
    removed: number;
    errors: number;
    filtered: number;
  };
};

const identity: Translate = (key) => key;
const ERROR = "adminPages.crawl.addDialog.errors";

export const createJobSourceSchema = (t: Translate = identity) =>
  z.object({
    provider: z.enum(["GREENHOUSE", "LEVER"], {
      error: t(`${ERROR}.provider`),
    }),
    boardToken: z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^[a-z0-9-]{1,100}$/, t(`${ERROR}.boardToken`)),
    companyName: z
      .string()
      .trim()
      .min(1, t(`${ERROR}.companyName`))
      .max(200, t(`${ERROR}.companyName`)),
  });

export type CreateJobSourceInput = z.infer<
  ReturnType<typeof createJobSourceSchema>
>;

export type CrawlRun = {
  _id: string;
  startedAt: string;
  finishedAt?: string;
  status: SyncStatus;
  error?: string;
  stats?: {
    listed: number;
    fetched: number;
    kept: number;
    rejected: number;
    created: number;
    closed: number;
  };
};

export type CrawledJob = {
  _id: string;
  sourceKey: string;
  title: string;
  companyName: string;
  location: string;
  sourceUrl: string;
  status: "ACTIVE" | "STALE" | "CLOSED";
  createdAt: string;
  removedAt?: string;
  removedBy?: { _id: string; email: string };
  removeReason?: string;
};

export type CrawlFailure = {
  _id: string;
  sourceKey: string;
  externalId: string;
  url?: string;
  title?: string;
  reason: RejectionReason;
  detail?: string;
  failedAt: string;
  retryAt: string;
};

export type CrawledJobsParams = {
  page: number;
  limit: number;
  sourceKey?: string;
  state?: CrawledJobState;
  keyword?: string;
  from?: string;
  to?: string;
};

export type CrawlFailuresParams = {
  page: number;
  limit: number;
  sourceKey?: string;
  reason?: RejectionReason;
  group: "error" | "filtered";
  from?: string;
  to?: string;
};
