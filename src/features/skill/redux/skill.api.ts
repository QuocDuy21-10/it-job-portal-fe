import { baseApi } from "@/lib/redux/api";
import { ApiResponse } from "@/shared/base/api-response.base";
import {
  SkillCatalogItem,
  GetSkillCatalogParams,
  PopularSkill,
  GetPopularSkillsParams,
} from "../schemas/skill.schema";

export const skillApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSkillCatalog: builder.query<
      ApiResponse<SkillCatalogItem[]>,
      GetSkillCatalogParams | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.search) searchParams.append("search", params.search);
        if (params?.limit)
          searchParams.append("limit", params.limit.toString());
        const qs = searchParams.toString();
        return {
          url: `/skills/catalog${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      keepUnusedDataFor: 86400, // Cache for 1 day
    }),
    getPopularSkills: builder.query<
      ApiResponse<PopularSkill[]>,
      GetPopularSkillsParams | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.limit)
          searchParams.append("limit", params.limit.toString());
        const qs = searchParams.toString();
        return {
          url: `/skills/popular${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      keepUnusedDataFor: 3600, // Cache for 1 hour
    }),
  }),
});

export const { useGetSkillCatalogQuery, useGetPopularSkillsQuery } = skillApi;

