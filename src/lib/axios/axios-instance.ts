import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { Mutex } from "async-mutex";
import { API_BASE_URL } from "@/shared/constants/constant";

const mutex = new Mutex();

// Custom header to avoid infinite retries
const NO_RETRY_HEADER = "x-no-retry";

let onRefreshTokenFailed: ((message: string) => void) | null = null;

export const setRefreshTokenFailedCallback = (
  callback: (message: string) => void
) => {
  onRefreshTokenFailed = callback;
};

// Flag to prevent refresh token calls after logout
let isLoggingOut = false;

export const setLoggingOutFlag = (value: boolean) => {
  isLoggingOut = value;
};

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, 
});

const handleRefreshToken = async (): Promise<string | null> => {
  return await mutex.runExclusive(async () => {
    // Skip refresh if user has logged out (may have changed while waiting for mutex)
    if (isLoggingOut || !localStorage.getItem("access_token")) {
      console.log("[Axios] Skipping refresh — user logged out");
      return null;
    }

    try {
      console.log("[Axios] Attempting to refresh token...");

     // The refresh_token cookie will be automatically sent (withCredentials: true)
      const response = await axios.get(`${API_BASE_URL}/auth/refresh`, {
        withCredentials: true,
        headers: {
          [NO_RETRY_HEADER]: "true", // Avoid retrying if refreshing API also gets 401
        },
      });

      const newAccessToken = response.data?.data?.access_token;

      if (newAccessToken) {
        localStorage.setItem("access_token", newAccessToken);
        console.log("[Axios] Token refreshed successfully");
        return newAccessToken;
      } else {
        console.error("[Axios] No access_token in refresh response");
        return null;
      }
    } catch (error) {
      console.error("[Axios] Refresh token failed:", error);
      return null;
    }
  });
};


// Request Interceptor: Add access_token to header before sending request
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem("access_token");

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Set Content-Type for JSON requests only (not for FormData)
    if (config.headers && !(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);
//  Response Interceptor: Process response and automatically refresh token when encountering 401
axiosInstance.interceptors.response.use(
  (response: any) => {
    // Success case - return data directly
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // CASE 1: 401 UNAUTHORIZED - ACCESS TOKEN EXPIRED
    if (error.response?.status === 401 && originalRequest) {
      // Check: No login/register API
      const isAuthApi =
        originalRequest.url?.includes("/login") ||
        originalRequest.url?.includes("/register");

      // Check: No retry (avoid infinite loop)
      const hasNoRetryHeader = originalRequest.headers?.[NO_RETRY_HEADER];

      if (!isAuthApi && !hasNoRetryHeader) {
        // Skip refresh if user has logged out
        if (isLoggingOut || !localStorage.getItem("access_token")) {
          console.log("[Axios] Skipping 401 refresh — user logged out");
          return Promise.reject(error);
        }

        console.log("[Axios] Got 401, attempting token refresh...");

        // Call refresh token
        const newAccessToken = await handleRefreshToken();

        if (newAccessToken) {
          // Refresh successful - Update header and retry request
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            originalRequest.headers[NO_RETRY_HEADER] = "true"; // Đánh dấu đã retry
          }

          console.log("[Axios] Retrying original request with new token...");
          return axiosInstance(originalRequest);
        } else {
          console.log(
            "[Axios] Refresh token failed, calling callback..."
          );

          localStorage.removeItem("access_token");
        }
      }
    }

    // CASE 2: 400 BAD REQUEST ON /auth/refresh
    // Refresh token expired hoặc invalid
    if (
      error.response?.status === 400 &&
      originalRequest?.url?.includes("/auth/refresh")
    ) {
      console.error("❌ [Axios] Refresh token expired or invalid");

      // Gọi callback thay vì dispatch (tránh circular dependency)
      if (onRefreshTokenFailed) {
        onRefreshTokenFailed(
          "Refresh token đã hết hạn. Vui lòng đăng nhập lại."
        );
      }

      localStorage.removeItem("access_token");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
