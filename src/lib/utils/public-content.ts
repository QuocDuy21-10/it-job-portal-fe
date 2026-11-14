import { cache } from "react";
import type {
  Company,
  TopHiringCompany,
} from "@/features/company/schemas/company.schema";
import type { Job } from "@/features/job/schemas/job.schema";
import type {
  ExternalJobDetail,
  JobSearchItem,
  JobSearchParams,
} from "@/features/job/schemas/job-search.schema";
import { toJobSearchQueryString } from "@/lib/utils/public-listing";
import type { ApiResponse } from "@/shared/base/api-response.base";
import { API_BASE_URL } from "@/shared/constants/constant";
import type {
  PaginatedQueryParams,
  PaginatedResult,
} from "@/shared/types/pagination";

// How long Next.js reuses a cached response before asking the backend again.
// Jobs change often; companies and aggregated external jobs rarely do.
const JOBS_REVALIDATE_SECONDS = 60;
const COMPANIES_REVALIDATE_SECONDS = 3600;
const EXTERNAL_JOBS_REVALIDATE_SECONDS = 3600;

async function fetchPublicEntity<T>(
  pathname: string,
  revalidate: number
): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${pathname}`, {
      next: { revalidate },
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
  keyword,
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

  if (keyword) {
    query += `&keyword=${encodeURIComponent(keyword)}`;
  }

  return query;
};

const fetchPublicJobsByQuery = cache((query: string) => {
  return fetchPublicEntity<PaginatedResult<Job>>(
    `/jobs?${query}`,
    JOBS_REVALIDATE_SECONDS
  );
});

const fetchPublicCompaniesByQuery = cache((query: string) => {
  return fetchPublicEntity<PaginatedResult<Company>>(
    `/companies?${query}`,
    COMPANIES_REVALIDATE_SECONDS
  );
});

export const fetchPublicJobById = cache((id: string) => {
  return fetchPublicEntity<Job>(
    `/jobs/${encodeURIComponent(id)}`,
    JOBS_REVALIDATE_SECONDS
  );
});

export const fetchPublicCompanyById = cache((id: string) => {
  return fetchPublicEntity<Company>(
    `/companies/${encodeURIComponent(id)}`,
    COMPANIES_REVALIDATE_SECONDS
  );
});

// Same URL as getTopHiringCompanies in company.api.ts, so both sides read one list.
export const fetchPublicTopHiringCompanies = cache((limit: number) => {
  return fetchPublicEntity<TopHiringCompany[]>(
    `/companies/top-hiring?limit=${limit}`,
    COMPANIES_REVALIDATE_SECONDS
  );
});

export const fetchPublicJobs = (params: PaginatedQueryParams) => {
  return fetchPublicJobsByQuery(buildPublicListQuery(params));
};

export const fetchPublicCompanies = (params: PaginatedQueryParams) => {
  return fetchPublicCompaniesByQuery(buildPublicListQuery(params));
};

const fetchPublicJobSearchByQuery = cache((query: string) => {
  return fetchPublicEntity<PaginatedResult<JobSearchItem>>(
    `/job-search?${query}`,
    JOBS_REVALIDATE_SECONDS
  );
});

export const fetchPublicJobSearch = (params: JobSearchParams) => {
  return fetchPublicJobSearchByQuery(toJobSearchQueryString(params));
};

export const fetchPublicExternalJobById = cache((id: string) => {
  return fetchPublicEntity<ExternalJobDetail>(
    `/job-search/external/${encodeURIComponent(id)}`,
    EXTERNAL_JOBS_REVALIDATE_SECONDS
  );
});
