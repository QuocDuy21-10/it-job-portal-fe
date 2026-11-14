import type { PaginatedQueryParams } from "@/shared/types/pagination";

// Shared by the server page and the client component: the server-rendered
// first page is only valid if both sides ask the backend for the same list.
export const HOME_TOP_COMPANIES_LIMIT = 8;

export const getHomeJobsQuery = (page: number): PaginatedQueryParams => ({
  page,
  limit: 6,
  filter: "isActive=true",
  sort: "sort=-createdAt",
});
