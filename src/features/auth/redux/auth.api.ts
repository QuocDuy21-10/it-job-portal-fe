import { baseApi } from "@/lib/redux/api";
import {
  AccountResponse,
  LoginFormData,
  LoginResponse,
  RegisterFormData,
  ForgotPasswordFormData,
  ChangePasswordFormData,
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

    verifyEmail: builder.mutation<
      ApiResponse<{ message: string }>,
      { _id: string; code: string }
    >({
      query: (data) => ({
        url: "/auth/verify",
        method: "POST",
        data,
      }),
    }),

    resendCode: builder.mutation<
      ApiResponse<{ message: string }>,
      { id: string }
    >({
      query: (data) => ({
        url: "/auth/resend-code",
        method: "POST",
        data,
      }),
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

    googleLogin: builder.mutation<
      ApiResponse<LoginResponse>,
      { idToken: string }
    >({
      query: (data) => ({
        url: "/auth/google/login",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Auth"],
    }),

    changePassword: builder.mutation<
      ApiResponse<{ message: string }>,
      ChangePasswordFormData
    >({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Auth"],
    }),

    forgotPassword: builder.mutation<
      ApiResponse<{ message: string }>,
      ForgotPasswordFormData
    >({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        data,
      }),
    }),

    resetPassword: builder.mutation<
      ApiResponse<{ message: string }>,
      { token: string; email: string; newPassword: string }
    >({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useRegisterMutation,
  useVerifyEmailMutation,
  useResendCodeMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGoogleLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = authApi;
