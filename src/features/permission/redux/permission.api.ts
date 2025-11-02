import { baseApi } from "@/lib/redux/api";
import { ApiResponse } from "@/shared/base/api-response.base";
import {
  CreatePermissionFormData,
  Permission,
  UpdatePermissionFormData,
} from "../schemas/permission.schema";

export const permissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPermissions: builder.query<
      ApiResponse<{
        result: Permission[];
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
          url: `/permissions?${query}`,
          method: "GET",
        };
      },
      providesTags: ["Permission"],
    }),

    // Get permission by id
    getPermission: builder.query<ApiResponse<Permission>, string>({
      query: (id) => ({
        url: `/permissions/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Permission", id }],
    }),

    // Create new permission
    createPermission: builder.mutation<
      ApiResponse<Permission>,
      CreatePermissionFormData
    >({
      query: (data) => ({
        url: "/permissions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Permission"],
    }),

    // Update permission
    updatePermission: builder.mutation<
      ApiResponse<Permission>,
      { id: string; data: UpdatePermissionFormData }
    >({
      query: ({ id, data }) => ({
        url: `/permissions/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Permission", id },
        "Permission",
      ],
    }),

    // Delete permission
    deletePermission: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/permissions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Permission"],
    }),
  }),
});

export const {
  useGetPermissionsQuery,
  useGetPermissionQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
} = permissionApi;
