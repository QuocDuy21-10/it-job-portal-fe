import { baseApi } from "@/lib/redux/api";
import { LoginFormData, LoginResponse } from "../schemas/auth.schema";
import { ApiResponse } from "@/shared/base/api-response.base";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<LoginResponse>, LoginFormData>({
      query: (credentials: LoginFormData) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    getMe: builder.query({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGetMeQuery,
  useRegisterMutation,
  useLogoutMutation,
} = authApi;
