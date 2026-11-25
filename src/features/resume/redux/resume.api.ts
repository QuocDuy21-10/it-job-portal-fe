import { baseApi } from "@/lib/redux/api";
import { buildListUrl } from "@/lib/utils/list-url";
import { ApiResponse } from "@/shared/base/api-response.base";
import {
  CountsQueryParams,
  PaginatedQueryParams,
  PaginatedResult,
} from "@/shared/types/pagination";
import { IBulkDeleteResult } from "@/shared/types/backend";
import {
  Resume,
  CreateResumeFormData,
  UpdateResumeFormData,
  ResumeFormData,
  ResumeAppliedJob,
  ResumeUpload,
  ResumeResponseUpload,
} from "../schemas/resume.schema";

export const resumeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getResumes: builder.query<
      ApiResponse<PaginatedResult<Resume>>,
      PaginatedQueryParams
    >({
      query: (params) => ({
        url: buildListUrl("/resumes", { page: 1, limit: 10, ...params }),
        method: "GET",
      }),
      providesTags: ["Resume"],
    }),

    getResumeCounts: builder.query<
      ApiResponse<Record<string, number>>,
      CountsQueryParams
    >({
      query: (params) => ({
        url: buildListUrl("/resumes/status-counts", params),
        method: "GET",
      }),
      providesTags: ["Resume"],
    }),

    // Get resume by id
    getResume: builder.query<ApiResponse<Resume>, string>({
      query: (id) => ({
        url: `/resumes/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Resume", id }],
    }),

    // Create new resume
    createResume: builder.mutation<ApiResponse<Resume>, CreateResumeFormData>({
      query: (data) => ({
        url: "/resumes",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["Resume"],
    }),

    // create new resume with upload
    createResumeWithUpload: builder.mutation<
      ApiResponse<ResumeResponseUpload>,
      { file: File; jobId: string }
    >({
      query: ({ file, jobId }) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("jobId", jobId);
        return {
          url: "/resumes/upload-cv",
          method: "POST",
          data: formData,
        };
      },
      invalidatesTags: ["Resume"],
    }),

    // Update resume
    updateResume: builder.mutation<
      ApiResponse<Resume>,
      { id: string; data: UpdateResumeFormData }
    >({
      query: ({ id, data }) => ({
        url: `/resumes/${id}`,
        method: "PATCH",
        data: data,
      }),
      // Fix: Add invalidation for both specific resume and list
      invalidatesTags: (result, error, { id }) => [
        { type: "Resume", id },
        "Resume",
      ],
    }),

    // Delete resume
    deleteResume: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/resumes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Resume"],
    }),

    // take out the applied job
    takeOutAppliedJob: builder.mutation<ApiResponse<ResumeAppliedJob>, string>({
      query: () => ({
        url: `/resumes/by-user`,
        method: "POST",
      }),
      invalidatesTags: ["Resume"],
    }),

    // Bulk delete resumes
    bulkDeleteResumes: builder.mutation<
      ApiResponse<IBulkDeleteResult>,
      string[]
    >({
      query: (ids) => ({
        url: "/resumes/bulk",
        method: "DELETE",
        data: { ids },
      }),
      invalidatesTags: ["Resume"],
    }),
  }),
});

export const {
  useGetResumesQuery,
  useGetResumeCountsQuery,
  useGetResumeQuery,
  useCreateResumeMutation,
  useCreateResumeWithUploadMutation,
  useUpdateResumeMutation,
  useDeleteResumeMutation,
  useTakeOutAppliedJobMutation,
  useBulkDeleteResumesMutation,
} = resumeApi;
