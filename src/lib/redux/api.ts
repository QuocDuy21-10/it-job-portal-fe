import { API_BASE_URL } from "@/shared/constants/constant";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getHello: builder.query<string, void>({
      query: () => ({
        url: "/",
        method: "GET",
      }),
    }),
  }),

  tagTypes: [],
});
