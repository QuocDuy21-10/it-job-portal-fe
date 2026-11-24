import { baseApi } from "@/lib/redux/api";
import type { ApiResponse } from "@/shared/base/api-response.base";
import type { PaginatedResult } from "@/shared/types/pagination";
import type {
  CrawlFailure,
  CrawlFailuresParams,
  CrawlRun,
  CrawledJob,
  CrawledJobsParams,
  CreateJobSourceInput,
  DisplayPolicy,
  JobSource,
} from "../schemas/crawl.schema";

type Modified = ApiResponse<{ modified: number }>;

// Empty filters are left out: the API rejects an empty enum value.
const toParams = (params: object) =>
  Object.fromEntries(Object.entries(params).filter(([, value]) => value));

export const crawlApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getJobSources: builder.query<ApiResponse<JobSource[]>, void>({
      query: () => ({ url: "/job-sources", method: "GET" }),
      providesTags: ["JobSource"],
    }),
    createJobSource: builder.mutation<
      ApiResponse<JobSource>,
      CreateJobSourceInput
    >({
      query: (data) => ({ url: "/job-sources", method: "POST", data }),
      invalidatesTags: ["JobSource"],
    }),
    updateJobSource: builder.mutation<
      ApiResponse<JobSource>,
      {
        key: string;
        data: { enabled?: boolean; displayPolicy?: DisplayPolicy };
      }
    >({
      query: ({ key, data }) => ({
        url: `/job-sources/${encodeURIComponent(key)}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["JobSource"],
    }),
    deleteJobSource: builder.mutation<
      ApiResponse<{ key: string; closed: number }>,
      string
    >({
      query: (key) => ({
        url: `/job-sources/${encodeURIComponent(key)}`,
        method: "DELETE",
      }),
      invalidatesTags: ["JobSource", "CrawledJob", "CrawlFailure"],
    }),
    syncJobSource: builder.mutation<ApiResponse<unknown>, string>({
      query: (key) => ({
        url: `/job-sources/${encodeURIComponent(key)}/sync`,
        method: "POST",
      }),
    }),
    getSourceRuns: builder.query<ApiResponse<CrawlRun[]>, string>({
      query: (key) => ({
        url: `/job-sources/${encodeURIComponent(key)}/runs?limit=50`,
        method: "GET",
      }),
      // Runs change in the background, so reopening the dialog always refetches.
      keepUnusedDataFor: 0,
    }),
    getCrawledJobs: builder.query<
      ApiResponse<PaginatedResult<CrawledJob>>,
      CrawledJobsParams
    >({
      query: (params) => ({
        url: "/crawled-jobs",
        method: "GET",
        params: toParams(params),
      }),
      providesTags: ["CrawledJob"],
    }),
    removeCrawledJobs: builder.mutation<
      Modified,
      { ids: string[]; reason: string }
    >({
      query: (data) => ({ url: "/crawled-jobs/remove", method: "POST", data }),
      invalidatesTags: ["CrawledJob", "JobSource"],
    }),
    restoreCrawledJobs: builder.mutation<Modified, string[]>({
      query: (ids) => ({
        url: "/crawled-jobs/restore",
        method: "POST",
        data: { ids },
      }),
      invalidatesTags: ["CrawledJob", "JobSource"],
    }),
    getCrawlFailures: builder.query<
      ApiResponse<PaginatedResult<CrawlFailure>>,
      CrawlFailuresParams
    >({
      query: (params) => ({
        url: "/crawl-failures",
        method: "GET",
        params: toParams(params),
      }),
      providesTags: ["CrawlFailure"],
    }),
    retryCrawlFailures: builder.mutation<Modified, string[]>({
      query: (ids) => ({
        url: "/crawl-failures/retry",
        method: "POST",
        data: { ids },
      }),
      invalidatesTags: ["CrawlFailure"],
    }),
  }),
});

export const {
  useGetJobSourcesQuery,
  useCreateJobSourceMutation,
  useUpdateJobSourceMutation,
  useDeleteJobSourceMutation,
  useSyncJobSourceMutation,
  useGetSourceRunsQuery,
  useGetCrawledJobsQuery,
  useRemoveCrawledJobsMutation,
  useRestoreCrawledJobsMutation,
  useGetCrawlFailuresQuery,
  useRetryCrawlFailuresMutation,
} = crawlApi;
