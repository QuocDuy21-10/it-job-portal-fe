import { baseApi } from "@/lib/redux/api";
import { buildListUrl } from "@/lib/utils/list-url";
import { ApiResponse } from "@/shared/base/api-response.base";
import {
  PaginatedQueryParams,
  PaginatedResult,
} from "@/shared/types/pagination";
import { IBulkDeleteResult } from "@/shared/types/backend";
import {
  Company,
  CreateCompanyFormData,
  TopHiringCompany,
  UpdateCompanyFormData,
} from "../schemas/company.schema";

// The form holds "" for "no logo", which the API refuses; null clears it.
const toCompanyBody = (data: UpdateCompanyFormData) =>
  data.logo === "" ? { ...data, logo: null } : data;

export const companyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCompanies: builder.query<
      ApiResponse<PaginatedResult<Company>>,
      PaginatedQueryParams
    >({
      query: (params) => ({
        url: buildListUrl("/companies", { page: 1, limit: 10, ...params }),
        method: "GET",
      }),
      providesTags: ["Company"],
    }),

    // Get company by id
    getCompany: builder.query<ApiResponse<Company>, string>({
      query: (id) => ({
        url: `/companies/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Company", id }],
    }),

    // Create new company
    createCompany: builder.mutation<
      ApiResponse<Company>,
      CreateCompanyFormData
    >({
      query: (data) => ({
        url: "/companies",
        method: "POST",
        data: toCompanyBody(data),
      }),
      invalidatesTags: ["Company"],
    }),

    // Update company
    updateCompany: builder.mutation<
      ApiResponse<Company>,
      { id: string; data: UpdateCompanyFormData }
    >({
      query: ({ id, data }) => ({
        url: `/companies/${id}`,
        method: "PATCH",
        data: toCompanyBody(data),
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Company", id },
        "Company",
      ],
    }),

    // Delete company
    deleteCompany: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/companies/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Company"],
    }),

    // Bulk delete companies
    bulkDeleteCompanies: builder.mutation<
      ApiResponse<IBulkDeleteResult>,
      string[]
    >({
      query: (ids) => ({
        url: "/companies/bulk",
        method: "DELETE",
        data: { ids },
      }),
      invalidatesTags: ["Company"],
    }),

    // Get top hiring companies
    getTopHiringCompanies: builder.query<
      ApiResponse<TopHiringCompany[]>,
      { limit?: number } | void
    >({
      query: (params) => {
        const limit = params?.limit;
        const query = limit ? `?limit=${limit}` : "";
        return {
          url: `/companies/top-hiring${query}`,
          method: "GET",
        };
      },
      providesTags: ["Company"],
    }),
  }),
});

export const {
  useGetCompaniesQuery,
  useGetCompanyQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
  useBulkDeleteCompaniesMutation,
  useGetTopHiringCompaniesQuery,
} = companyApi;
