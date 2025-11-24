import { baseApi } from "@/lib/redux/api";
import { ApiResponse } from "@/shared/base/api-response.base";
import {
  CreateUserFormData,
  User,
  UpdateUserFormData,
} from "../schemas/user.schema";
import { authApi } from "@/features/auth/redux/auth.api";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<
      ApiResponse<{
        result: User[];
        meta: {
          totalItems: number;
          itemCount: number;
          itemsPerPage: number;
          totalPages: number;
          currentPage: number;
        };
      }>,
      {
        page?: number;
        limit?: number;
        filter?: string;
        sort?: string;
      }
    >({
      query: ({ page = 1, limit = 10, filter = "", sort = "createdAt" }) => {
        let query = `page=${page}&limit=${limit}`;
        if (filter) query += `&${filter}`;
        if (sort) query += `&${sort}`;

        return {
          url: `/users?${query}`,
          method: "GET",
        };
      },
      providesTags: ["User"],
    }),

    // Get user by id
    getUser: builder.query<ApiResponse<User>, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    // Create new user
    createUser: builder.mutation<ApiResponse<User>, CreateUserFormData>({
      query: (data) => ({
        url: "/users",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["User"],
    }),

    // Update user
    updateUser: builder.mutation<
      ApiResponse<User>,
      { id: string; data: UpdateUserFormData }
    >({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id },
        "User",
      ],
    }),

    // Delete user
    deleteUser: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    // Save job to favorites
    saveJob: builder.mutation<ApiResponse<string>, string>({
      query: (jobId) => ({
        url: "/users/save-job",
        method: "POST",
        data: { jobId },
      }),
      invalidatesTags: ["Auth", "User"],
      // Optimistic update
      async onQueryStarted(jobId, { dispatch, queryFulfilled }) {
        // Optimistically update getMe cache
        const patchResult = dispatch(
          authApi.util.updateQueryData("getMe", undefined, (draft) => {
            if (draft.data?.user) {
              const currentFavorites = draft.data.user.jobFavorites || [];
              if (!currentFavorites.includes(jobId)) {
                draft.data.user.jobFavorites = [...currentFavorites, jobId];
              }
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    // Unsave job from favorites
    unsaveJob: builder.mutation<ApiResponse<string>, string>({
      query: (jobId) => ({
        url: "/users/save-job",
        method: "DELETE",
        data: { jobId },
      }),
      invalidatesTags: ["Auth", "User"],
      // Optimistic update
      async onQueryStarted(jobId, { dispatch, queryFulfilled }) {
        // Optimistically update getMe cache
        const patchResult = dispatch(
          authApi.util.updateQueryData("getMe", undefined, (draft) => {
            if (draft.data?.user) {
              const currentFavorites = draft.data.user.jobFavorites || [];
              draft.data.user.jobFavorites = currentFavorites.filter(
                (id: string) => id !== jobId
              );
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    // Get saved jobs
    getSavedJobs: builder.query<
      ApiResponse<{
        result: Array<{
          _id: string;
          name: string;
          skills: string[];
          company: {
            _id: string;
            name: string;
            logo: string;
          };
          location: string;
          salary: number;
          level: string;
          startDate: string;
          endDate: string;
          formOfWork: string;
        }>;
        meta: {
          current: number;
          pageSize: number;
          pages: number;
          total: number;
        };
      }>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `/users/saved-jobs?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // Follow company
    followCompany: builder.mutation<ApiResponse<string>, string>({
      query: (companyId) => ({
        url: "/users/follow-company",
        method: "POST",
        data: { companyId },
      }),
      invalidatesTags: ["Auth", "User"],
      // Optimistic update
      async onQueryStarted(companyId, { dispatch, queryFulfilled }) {
        // Optimistically update getMe cache
        const patchResult = dispatch(
          authApi.util.updateQueryData("getMe", undefined, (draft) => {
            if (draft.data?.user) {
              const currentFollowing = draft.data.user.companyFollowing || [];
              if (!currentFollowing.includes(companyId)) {
                draft.data.user.companyFollowing = [...currentFollowing, companyId];
              }
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    // Unfollow company
    unfollowCompany: builder.mutation<ApiResponse<string>, string>({
      query: (companyId) => ({
        url: "/users/follow-company",
        method: "DELETE",
        data: { companyId },
      }),
      invalidatesTags: ["Auth", "User"],
      // Optimistic update
      async onQueryStarted(companyId, { dispatch, queryFulfilled }) {
        // Optimistically update getMe cache
        const patchResult = dispatch(
          authApi.util.updateQueryData("getMe", undefined, (draft) => {
            if (draft.data?.user) {
              const currentFollowing = draft.data.user.companyFollowing || [];
              draft.data.user.companyFollowing = currentFollowing.filter(
                (id: string) => id !== companyId
              );
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    // Get following companies
    getFollowingCompanies: builder.query<
      ApiResponse<{
        result: Array<{
          _id: string;
          name: string;
          logo: string;
          address: string;
          description: string;
          numberOfEmployees: string;
          website: string;
        }>;
        meta: {
          current: number;
          pageSize: number;
          pages: number;
          total: number;
        };
      }>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `/users/following-companies?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useSaveJobMutation,
  useUnsaveJobMutation,
  useGetSavedJobsQuery,
  useFollowCompanyMutation,
  useUnfollowCompanyMutation,
  useGetFollowingCompaniesQuery,
} = userApi;
