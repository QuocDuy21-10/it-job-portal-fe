import { API_BASE_URL } from "@/shared/constants/constant";
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/lib/axios/axios-base-query";


export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({ baseUrl: API_BASE_URL }),

  // Define tag types for cache invalidation
  tagTypes: ["Auth", "User", "Company", "Job", "Resume", "Permission", "Role", "CVProfile"],

  endpoints: (builder) => ({
    getHello: builder.query<string, void>({
      query: () => ({
        url: "/",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetHelloQuery } = baseApi;
