import { baseApi } from "@/lib/redux/api";
import type { AppLocale } from "@/i18n/routing";
import type { ApiResponse } from "@/shared/base/api-response.base";
import type {
  Banner,
  BannerInput,
  LegalPageContent,
  LegalPageInput,
  LegalPageKey,
} from "../schemas/site-content.schema";

type LegalPageRef = { page: LegalPageKey; locale: AppLocale };

const legalUrl = ({ page, locale }: LegalPageRef) =>
  `/site-content/legal/${page}/${locale}`;
const legalTag = ({ page, locale }: LegalPageRef) =>
  ({ type: "LegalPage", id: `${page}-${locale}` }) as const;

export const siteContentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBanners: builder.query<ApiResponse<Banner[]>, void>({
      query: () => ({ url: "/site-content/banners", method: "GET" }),
      providesTags: ["Banner"],
    }),
    createBanner: builder.mutation<ApiResponse<Banner>, BannerInput>({
      query: (data) => ({ url: "/site-content/banners", method: "POST", data }),
      invalidatesTags: ["Banner"],
    }),
    updateBanner: builder.mutation<
      ApiResponse<Banner>,
      { id: string; data: BannerInput }
    >({
      query: ({ id, data }) => ({
        url: `/site-content/banners/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["Banner"],
    }),
    setBannerVisibility: builder.mutation<
      ApiResponse<Banner>,
      { id: string; isActive: boolean }
    >({
      query: ({ id, isActive }) => ({
        url: `/site-content/banners/${id}/visibility`,
        method: "PATCH",
        data: { isActive },
      }),
      invalidatesTags: ["Banner"],
    }),
    reorderBanners: builder.mutation<ApiResponse<Banner[]>, string[]>({
      query: (ids) => ({
        url: "/site-content/banners/order",
        method: "PUT",
        data: { ids },
      }),
      invalidatesTags: ["Banner"],
    }),
    deleteBanner: builder.mutation<ApiResponse<{ deleted: true }>, string>({
      query: (id) => ({ url: `/site-content/banners/${id}`, method: "DELETE" }),
      invalidatesTags: ["Banner"],
    }),
    getLegalPage: builder.query<ApiResponse<LegalPageContent>, LegalPageRef>({
      query: (ref) => ({ url: legalUrl(ref), method: "GET" }),
      providesTags: (_result, _error, ref) => [legalTag(ref)],
    }),
    updateLegalPage: builder.mutation<
      ApiResponse<LegalPageContent>,
      LegalPageRef & { data: LegalPageInput }
    >({
      query: ({ data, ...ref }) => ({
        url: legalUrl(ref),
        method: "PUT",
        data,
      }),
      invalidatesTags: (_result, error, ref) => (error ? [] : [legalTag(ref)]),
    }),
  }),
});

export const {
  useGetBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useSetBannerVisibilityMutation,
  useReorderBannersMutation,
  useDeleteBannerMutation,
  useGetLegalPageQuery,
  useUpdateLegalPageMutation,
} = siteContentApi;
