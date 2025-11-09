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
        data: credentials,
      }),
      // Invalidate cache sau khi login thành công
      invalidatesTags: ["Auth"],
    }),

    getMe: builder.query<ApiResponse<AccountResponse>, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      // Provide tag để có thể invalidate cache
      providesTags: ["Auth"],
    }),

    register: builder.mutation<ApiResponse<LoginResponse>, RegisterFormData>({
      query: (userData: RegisterFormData) => ({
        url: "/auth/register",
        method: "POST",
        data: userData, 
      }),
      invalidatesTags: ["Auth"],
    }),
    logout: builder.mutation<ApiResponse<any>, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      // Invalidate tất cả cache khi logout
      invalidatesTags: ["Auth", "User", "Company", "Job", "Resume"],
    }),

    refreshToken: builder.mutation<
      ApiResponse<{ access_token: string }>,
      void
    >({
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
      }),
    }),
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
