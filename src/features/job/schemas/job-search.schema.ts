export const JOB_SEARCH_SOURCES = ["all", "internal", "external"] as const;
export type JobSearchSource = (typeof JOB_SEARCH_SOURCES)[number];

export type JobSearchSort = "newest" | "oldest" | "salary_desc" | "salary_asc";

export type JobSearchItem = {
  id: string;
  sourceType: "INTERNAL" | "EXTERNAL";
  sourceKey?: string;
  title: string;
  companyName: string;
  companyLogo?: string | null;
  location: string;
  locationCode?: string;
  salary?: number;
  salaryText?: string;
  level?: string;
  formOfWork?: string;
  isRemote: boolean;
  skills: string[];
  postedAt: string;
  endDate?: string | null;
  applyMode: "INTERNAL" | "EXTERNAL_REDIRECT";
  applyUrl?: string;
};

export type ExternalJobDetail = {
  id: string;
  sourceKey: string;
  title: string;
  companyName: string;
  location: string;
  locationCode?: string;
  isRemote: boolean;
  skills: string[];
  level?: string;
  salaryText?: string;
  descriptionHtml: string;
  postedAt: string;
  sourceUrl: string;
  applyUrl: string;
  status: "ACTIVE" | "CLOSED";
  // Optional so the page keeps working against a backend that predates it.
  displayPolicy?: "LINK_ONLY" | "FULL";
};

export type JobSearchParams = {
  keyword?: string;
  locationCode?: string;
  level?: string;
  formOfWork?: string;
  salaryMin?: number;
  salaryMax?: number;
  source?: Exclude<JobSearchSource, "all">;
  sort: JobSearchSort;
  page: number;
  limit: number;
};
