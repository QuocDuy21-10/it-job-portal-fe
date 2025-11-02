import { baseApi } from "@/lib/redux/api";
import { ApiResponse } from "@/shared/base/api-response.base";
import {
  CreateUserFormData,
  User,
  UpdateUserFormData,
} from "../schemas/user.schema";

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
        body: data,
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
        body: data,
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
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
