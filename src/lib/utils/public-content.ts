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
import type {
  BannerSlide,
  LegalPageContent,
  LegalPageKey,
} from "@/features/site-content/schemas/site-content.schema";
import type { AppLocale } from "@/i18n/routing";
import { toJobSearchQueryString } from "@/lib/utils/public-listing";
import type { ApiResponse } from "@/shared/base/api-response.base";
import { API_BASE_URL } from "@/shared/constants/constant";
import type { IPublicStats } from "@/shared/types/dashboard";
import type {
  PaginatedQueryParams,
  PaginatedResult,
} from "@/shared/types/pagination";

// How long Next.js reuses a cached response before asking the backend again.
// Jobs and aggregated external jobs change often; companies rarely do.
const JOBS_REVALIDATE_SECONDS = 60;
const COMPANIES_REVALIDATE_SECONDS = 3600;
// Short, so a job taken down by an admin leaves the site within about a minute.
const EXTERNAL_JOBS_REVALIDATE_SECONDS = 60;
const SITE_CONTENT_REVALIDATE_SECONDS = 60;
const FETCH_TIMEOUT_MS = 10_000;
// The backend caps `limit` at this value (MAX_PAGE_LIMIT).
const MAX_PAGE_SIZE = 100;

// 404 and 400 (malformed id) mean "no such public item". Anything else is thrown: a detail page
// that answered 404 during a backend outage would be dropped from Google's index.
async function fetchPublicEntity<T>(
  pathname: string,
  revalidate: number
): Promise<T | null> {
  const response = await fetch(`${API_BASE_URL}${pathname}`, {
    next: { revalidate },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

  if (response.status === 404 || response.status === 400) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Backend answered ${response.status} for ${pathname}`);
  }

  const payload = (await response.json()) as ApiResponse<T>;

  return payload.data ?? null;
}

// Listing pages fetch in the browser when the server got nothing, so they swallow errors.
const nullOnError = <T>(request: Promise<T | null>) =>
  request.catch(() => null);

// Sequential on purpose: the backend rate-limits bursts of requests.
async function fetchAllPages<T>(
  pathname: string,
  revalidate: number
): Promise<T[]> {
  const items: T[] = [];

  for (let page = 1, totalPages = 1; page <= totalPages; page += 1) {
    const data = await fetchPublicEntity<PaginatedResult<T>>(
      `${pathname}?page=${page}&limit=${MAX_PAGE_SIZE}`,
      revalidate
    );

    if (!data) {
      throw new Error(`Backend returned no data for ${pathname} page ${page}`);
    }

    items.push(...data.result);
    totalPages = data.meta.pagination.total_pages;
  }

  return items;
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
  return nullOnError(
    fetchPublicEntity<TopHiringCompany[]>(
      `/companies/top-hiring?limit=${limit}`,
      COMPANIES_REVALIDATE_SECONDS
    )
  );
});

export const fetchPublicJobs = (params: PaginatedQueryParams) => {
  return nullOnError(fetchPublicJobsByQuery(buildPublicListQuery(params)));
};

export const fetchPublicCompanies = (params: PaginatedQueryParams) => {
  return nullOnError(fetchPublicCompaniesByQuery(buildPublicListQuery(params)));
};

const fetchPublicJobSearchByQuery = cache((query: string) => {
  return fetchPublicEntity<PaginatedResult<JobSearchItem>>(
    `/job-search?${query}`,
    JOBS_REVALIDATE_SECONDS
  );
});

export const fetchPublicJobSearch = (params: JobSearchParams) => {
  return nullOnError(
    fetchPublicJobSearchByQuery(toJobSearchQueryString(params))
  );
};

// Landing pages: a backend failure must be a 500, not a page with an empty list.
export const fetchPublicJobSearchStrict = (params: JobSearchParams) => {
  return fetchPublicJobSearchByQuery(toJobSearchQueryString(params));
};

export const fetchPublicExternalJobById = cache((id: string) => {
  return fetchPublicEntity<ExternalJobDetail>(
    `/job-search/external/${encodeURIComponent(id)}`,
    EXTERNAL_JOBS_REVALIDATE_SECONDS
  );
});

// For the sitemap: every public item, or an error. Never a partial list.
export const fetchAllPublicJobs = () =>
  fetchAllPages<Job>("/jobs", JOBS_REVALIDATE_SECONDS);

export const fetchAllPublicCompanies = () =>
  fetchAllPages<Company>("/companies", COMPANIES_REVALIDATE_SECONDS);

// No slides, or no backend, both fall back to the default hero image.
export const fetchPublicBannerSlides = cache(
  async (): Promise<BannerSlide[]> =>
    (await nullOnError(
      fetchPublicEntity<BannerSlide[]>(
        "/site-content/banners/public",
        SITE_CONTENT_REVALIDATE_SECONDS
      )
    )) ?? []
);

// The hero hides the stats row on null, so a missing endpoint or outage shows no numbers.
export const fetchPublicStats = cache(() =>
  nullOnError(
    fetchPublicEntity<IPublicStats>(
      "/statistics/public",
      SITE_CONTENT_REVALIDATE_SECONDS
    )
  )
);

export const fetchPublicLegalPage = cache(
  (page: LegalPageKey, locale: AppLocale) =>
    fetchPublicEntity<LegalPageContent>(
      `/site-content/legal/${page}/${locale}`,
      SITE_CONTENT_REVALIDATE_SECONDS
    )
);
