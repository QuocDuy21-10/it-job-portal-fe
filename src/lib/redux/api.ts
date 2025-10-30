import { API_BASE_URL } from "@/shared/constants/constant";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: "include", // Quan trọng để gửi cookies (refresh token)
    prepareHeaders: (headers) => {
      // Thêm access token vào headers nếu có
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("access_token");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),

  // Define tag types cho cache invalidation
  tagTypes: ["Auth", "User", "Company", "Job", "Resume", "Permission", "Role"],

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
