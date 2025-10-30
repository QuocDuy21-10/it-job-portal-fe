import { baseApi } from "@/lib/redux/api";
import { ApiResponse } from "@/shared/base/api-response.base";
import {
  Permission,
  CreatePermissionFormData,
  UpdatePermissionFormData,
} from "../schemas/permission.schema";

export const permissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCompanies: builder.query<
      ApiResponse<{
        result: Permission[];
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
          url: `/permissions?${query}`,
          method: "GET",
        };
      },
    }),

    // Get permission by id
    getCompany: builder.query<ApiResponse<Permission>, string>({
      query: (id) => ({
        url: `/permissions/${id}`,
        method: "GET",
      }),
    }),

    // Create new permission
    createCompany: builder.mutation<
      ApiResponse<Permission>,
      CreatePermissionFormData
    >({
      query: (data) => ({
        url: "/permissions",
        method: "POST",
        body: data,
      }),
    }),

    // Update permission
    updateCompany: builder.mutation<
      ApiResponse<Permission>,
      { id: string; data: UpdatePermissionFormData }
    >({
      query: ({ id, data }) => ({
        url: `/permissions/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),

    // Delete permission
    deleteCompany: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/permissions/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetCompaniesQuery,
  useGetCompanyQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
} = companyApi;
