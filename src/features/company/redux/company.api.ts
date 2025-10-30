import { baseApi } from "@/lib/redux/api";
import { ApiResponse } from "@/shared/base/api-response.base";
import {
  Company,
  CreateCompanyFormData,
  UpdateCompanyFormData,
} from "../schemas/company.schema";

export const companyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCompanies: builder.query<
      ApiResponse<{
        result: Company[];
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
          url: `/companies?${query}`,
          method: "GET",
        };
      },
    }),

    // Get company by id
    getCompany: builder.query<ApiResponse<Company>, string>({
      query: (id) => ({
        url: `/companies/${id}`,
        method: "GET",
      }),
    }),

    // Create new company
    createCompany: builder.mutation<
      ApiResponse<Company>,
      CreateCompanyFormData
    >({
      query: (data) => ({
        url: "/companies",
        method: "POST",
        body: data,
      }),
    }),

    // Update company
    updateCompany: builder.mutation<
      ApiResponse<Company>,
      { id: string; data: UpdateCompanyFormData }
    >({
      query: ({ id, data }) => ({
        url: `/companies/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),

    // Delete company
    deleteCompany: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/companies/${id}`,
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
