import { baseApi } from "@/lib/redux/api";
import { ApiResponse } from "@/shared/base/api-response.base";
import {
  Job,
  CreateJobFormData,
  UpdateJobFormData,
} from "../schemas/job.schema";

export const jobApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getJobs: builder.query<
      ApiResponse<{
        result: Job[];
        meta: {
          pagination: {
            current_page: number;
            per_page: number;
            total_pages: number;
            total: number;
          };
        };
      }>,
      {
        page?: number;
        limit?: number;
        filter?: string;
        sort?: string;
      }
    >({
      query: ({ page = 1, limit = 10, filter = "", sort = "" }) => {
        let query = `page=${page}&limit=${limit}`;
        if (filter) query += `&${filter}`;
        if (sort) query += `&${sort}`;

        return {
          url: `/jobs?${query}`,
          method: "GET",
        };
      },
      providesTags: ["Job"],
    }),

    // Get company by id
    getJob: builder.query<ApiResponse<Job>, string>({
      query: (id) => ({
        url: `/jobs/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Job", id }],
    }),

    // Create new company
    createJob: builder.mutation<ApiResponse<Job>, CreateJobFormData>({
      query: (data) => ({
        url: "/jobs",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["Job"],
    }),

    // Update company
    updateJob: builder.mutation<
      ApiResponse<Job>,
      { id: string; data: UpdateJobFormData }
    >({
      query: ({ id, data }) => ({
        url: `/jobs/${id}`,
        method: "PATCH",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Job", id }, "Job"],
    }),

    // Delete company
    deleteJob: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/jobs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Job"],
    }),
  }),
});

export const {
  useGetJobsQuery,
  useGetJobQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
} = jobApi;
