import type { PaginatedQueryParams } from "@/shared/types/pagination";
import { resolveLocationCode } from "@/shared/data/location-catalog";

export const DEFAULT_JOB_LIST_PAGE_SIZE = 10;
export const DEFAULT_COMPANY_LIST_PAGE_SIZE = 9;
export const DEFAULT_JOB_LIST_SORT = "-createdAt";

const JOB_TYPE_VALUES = [
  "all",
  "Full-time",
  "Part-time",
  "Internship",
  "Freelance",
  "Remote",
  "Hybrid",
  "Other",
] as const;

const JOB_LEVEL_VALUES = [
  "all",
  "Internship",
  "Junior",
  "Mid",
  "Senior",
  "Lead",
  "Manager",
] as const;

const JOB_SALARY_RANGE_VALUES = [
  "all",
  "0-10000000",
  "10000000-20000000",
  "20000000-50000000",
  "50000000-999999999",
] as const;

const JOB_SORT_VALUES = [
  DEFAULT_JOB_LIST_SORT,
  "createdAt",
  "-salary",
  "salary",
] as const;

type SearchParamsSource =
  | URLSearchParams
  | Record<string, string | string[] | undefined>;

export type JobListSearchState = {
  experience: string;
  limit: number;
  locationCode: string;
  page: number;
  q: string;
  salary: string;
  sort: string;
  type: string;
};

export type CompanyListSearchState = {
  limit: number;
  page: number;
  q: string;
};

const getSingleSearchParam = (
  searchParams: SearchParamsSource,
  key: string
) => {
  if (searchParams instanceof URLSearchParams) {
    return searchParams.get(key) ?? undefined;
  }

  const value = searchParams[key];

  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

const parsePositiveInt = (value: string | undefined, defaultValue: number) => {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    return defaultValue;
  }

  return parsedValue;
};

const normalizeStringParam = (value: string | undefined) => {
  return value?.trim() ?? "";
};

const normalizeLocationParam = (searchParams: SearchParamsSource) => {
  const locationCode = resolveLocationCode(
    getSingleSearchParam(searchParams, "locationCode")
  );

  if (locationCode) {
    return locationCode;
  }

  return resolveLocationCode(getSingleSearchParam(searchParams, "location"));
};

const normalizeEnumParam = (
  value: string | undefined,
  allowedValues: readonly string[],
  fallbackValue: string
) => {
  return value && allowedValues.includes(value) ? value : fallbackValue;
};

export const parseJobListSearchParams = (
  searchParams: SearchParamsSource
): JobListSearchState => {
  return {
    experience: normalizeEnumParam(
      getSingleSearchParam(searchParams, "experience"),
      JOB_LEVEL_VALUES,
      "all"
    ),
    limit: parsePositiveInt(
      getSingleSearchParam(searchParams, "limit"),
      DEFAULT_JOB_LIST_PAGE_SIZE
    ),
    locationCode: normalizeLocationParam(searchParams),
    page: parsePositiveInt(getSingleSearchParam(searchParams, "page"), 1),
    q: normalizeStringParam(getSingleSearchParam(searchParams, "q")),
    salary: normalizeEnumParam(
      getSingleSearchParam(searchParams, "salary"),
      JOB_SALARY_RANGE_VALUES,
      "all"
    ),
    sort: normalizeEnumParam(
      getSingleSearchParam(searchParams, "sort"),
      JOB_SORT_VALUES,
      DEFAULT_JOB_LIST_SORT
    ),
    type: normalizeEnumParam(
      getSingleSearchParam(searchParams, "type"),
      JOB_TYPE_VALUES,
      "all"
    ),
  };
};

export const parseCompanyListSearchParams = (
  searchParams: SearchParamsSource
): CompanyListSearchState => {
  return {
    limit: parsePositiveInt(
      getSingleSearchParam(searchParams, "limit"),
      DEFAULT_COMPANY_LIST_PAGE_SIZE
    ),
    page: parsePositiveInt(getSingleSearchParam(searchParams, "page"), 1),
    q: normalizeStringParam(getSingleSearchParam(searchParams, "q")),
  };
};

export const buildJobListFilter = (searchState: JobListSearchState) => {
  const filters = ["isActive=true"];

  if (searchState.locationCode) {
    filters.push(`locationCode=${encodeURIComponent(searchState.locationCode)}`);
  }

  if (searchState.type !== "all") {
    filters.push(`formOfWork=${searchState.type}`);
  }

  if (searchState.experience !== "all") {
    filters.push(`level=${searchState.experience}`);
  }

  if (searchState.salary !== "all") {
    const [minSalary, maxSalary] = searchState.salary.split("-");

    if (minSalary) {
      filters.push(`salary>=${minSalary}`);
    }

    if (maxSalary) {
      filters.push(`salary<=${maxSalary}`);
    }
  }

  return filters.join("&");
};

export const buildJobListQueryArgs = (
  searchState: JobListSearchState
): PaginatedQueryParams => {
  return {
    filter: buildJobListFilter(searchState),
    keyword: searchState.q || undefined,
    limit: searchState.limit,
    page: searchState.page,
    sort: `sort=${searchState.sort}`,
  };
};

export const buildCompanyListQueryArgs = (
  searchState: CompanyListSearchState
): PaginatedQueryParams => {
  return {
    filter: searchState.q
      ? `name=/${encodeURIComponent(searchState.q)}/i`
      : "",
    limit: searchState.limit,
    page: searchState.page,
  };
};

export const buildJobListUrlSearchParams = (searchState: JobListSearchState) => {
  const params = new URLSearchParams();

  if (searchState.q) {
    params.set("q", searchState.q);
  }

  if (searchState.locationCode) {
    params.set("locationCode", searchState.locationCode);
  }

  if (searchState.type !== "all") {
    params.set("type", searchState.type);
  }

  if (searchState.experience !== "all") {
    params.set("experience", searchState.experience);
  }

  if (searchState.salary !== "all") {
    params.set("salary", searchState.salary);
  }

  if (searchState.sort !== DEFAULT_JOB_LIST_SORT) {
    params.set("sort", searchState.sort);
  }

  if (searchState.page > 1) {
    params.set("page", String(searchState.page));
  }

  if (searchState.limit !== DEFAULT_JOB_LIST_PAGE_SIZE) {
    params.set("limit", String(searchState.limit));
  }

  return params;
};

export const buildCompanyListUrlSearchParams = (
  searchState: CompanyListSearchState
) => {
  const params = new URLSearchParams();

  if (searchState.q) {
    params.set("q", searchState.q);
  }

  if (searchState.page > 1) {
    params.set("page", String(searchState.page));
  }

  if (searchState.limit !== DEFAULT_COMPANY_LIST_PAGE_SIZE) {
    params.set("limit", String(searchState.limit));
  }

  return params;
};

export const buildPathWithSearchParams = (
  pathname: string,
  searchParams: URLSearchParams
) => {
  const queryString = searchParams.toString();

  return queryString ? `${pathname}?${queryString}` : pathname;
};

export const getJobListCanonicalPath = (searchState: JobListSearchState) => {
  const isIndexableVariant =
    !searchState.q &&
    !searchState.locationCode &&
    searchState.type === "all" &&
    searchState.experience === "all" &&
    searchState.salary === "all" &&
    searchState.sort === DEFAULT_JOB_LIST_SORT &&
    searchState.limit === DEFAULT_JOB_LIST_PAGE_SIZE;

  if (!isIndexableVariant) {
    return "/jobs";
  }

  const canonicalParams = new URLSearchParams();

  if (searchState.page > 1) {
    canonicalParams.set("page", String(searchState.page));
  }

  return buildPathWithSearchParams("/jobs", canonicalParams);
};

export const getCompanyListCanonicalPath = (
  searchState: CompanyListSearchState
) => {
  const isIndexableVariant =
    !searchState.q && searchState.limit === DEFAULT_COMPANY_LIST_PAGE_SIZE;

  if (!isIndexableVariant) {
    return "/companies";
  }

  const canonicalParams = new URLSearchParams();

  if (searchState.page > 1) {
    canonicalParams.set("page", String(searchState.page));
  }

  return buildPathWithSearchParams("/companies", canonicalParams);
};

export const areJobListSearchStatesEqual = (
  left: JobListSearchState,
  right: JobListSearchState
) => {
  return (
    left.experience === right.experience &&
    left.limit === right.limit &&
    left.locationCode === right.locationCode &&
    left.page === right.page &&
    left.q === right.q &&
    left.salary === right.salary &&
    left.sort === right.sort &&
    left.type === right.type
  );
};

export const areCompanyListSearchStatesEqual = (
  left: CompanyListSearchState,
  right: CompanyListSearchState
) => {
  return (
    left.limit === right.limit &&
    left.page === right.page &&
    left.q === right.q
  );
};
