import { baseApi } from "@/lib/redux/api";
import {
  AccountResponse,
  LoginFormData,
  LoginResponse,
  RegisterFormData,
} from "../schemas/auth.schema";
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

    // Get current user info
    getMe: builder.query<ApiResponse<AccountResponse>, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
    }),

    register: builder.mutation<ApiResponse<LoginResponse>, RegisterFormData>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),

    logout: builder.mutation<ApiResponse<any>, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

    // Refresh token endpoint (nếu cần)
    refreshToken: builder.mutation<ApiResponse<{ access_token: string }>, void>(
      {
        query: () => ({
          url: "/auth/refresh",
          method: "POST",
        }),
      }
    ),
  }),
});

export const {
  useLoginMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
} = authApi;
