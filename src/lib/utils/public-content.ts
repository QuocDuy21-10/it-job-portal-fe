import { cache } from "react";
import type { Company } from "@/features/company/schemas/company.schema";
import type { Job } from "@/features/job/schemas/job.schema";
import type { ApiResponse } from "@/shared/base/api-response.base";
import { API_BASE_URL } from "@/shared/constants/constant";
import type { PaginatedQueryParams, PaginatedResult } from "@/shared/types/pagination";

const PUBLIC_CONTENT_REVALIDATE_SECONDS = 300;

async function fetchPublicEntity<T>(pathname: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${pathname}`, {
      next: { revalidate: PUBLIC_CONTENT_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as ApiResponse<T>;

    return payload.data ?? null;
  } catch {
    return null;
  }
}

const buildPublicListQuery = ({
  filter = "",
  limit = 10,
  page = 1,
  sort = "",
}: PaginatedQueryParams) => {
  let query = `page=${page}&limit=${limit}`;

  if (filter) {
    query += `&${filter}`;
  }

  if (sort) {
    query += `&${sort}`;
  }

  return query;
};

const fetchPublicJobsByQuery = cache((query: string) => {
  return fetchPublicEntity<PaginatedResult<Job>>(`/jobs?${query}`);
});

const fetchPublicCompaniesByQuery = cache((query: string) => {
  return fetchPublicEntity<PaginatedResult<Company>>(`/companies?${query}`);
});

export const fetchPublicJobById = cache((id: string) => {
  return fetchPublicEntity<Job>(`/jobs/${encodeURIComponent(id)}`);
});

export const fetchPublicCompanyById = cache((id: string) => {
  return fetchPublicEntity<Company>(`/companies/${encodeURIComponent(id)}`);
});

export const fetchPublicJobs = (params: PaginatedQueryParams) => {
  return fetchPublicJobsByQuery(buildPublicListQuery(params));
};

export const fetchPublicCompanies = (params: PaginatedQueryParams) => {
  return fetchPublicCompaniesByQuery(buildPublicListQuery(params));
};