import type { PaginatedQueryParams } from "@/shared/types/pagination";

// Shared by the server page and the client component: the server-rendered
// first page is only valid if both sides ask the backend for the same list.
export const HOME_TOP_COMPANIES_LIMIT = 8;

export const HOME_JOBS_SORTS = {
  latest: "-createdAt",
  topSalary: "-salary",
} as const;

export type HomeJobsTab = keyof typeof HOME_JOBS_SORTS;

export const getHomeJobsQuery = (tab: HomeJobsTab): PaginatedQueryParams => ({
  page: 1,
  limit: 6,
  filter: "isActive=true",
  sort: `sort=${HOME_JOBS_SORTS[tab]}`,
});
