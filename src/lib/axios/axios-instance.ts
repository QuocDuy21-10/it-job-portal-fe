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

// CREATE AXIOS INSTANCE
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Send cookie (refresh token)
  headers: {
    "Content-Type": "application/json",
  },
});

const handleRefreshToken = async (): Promise<string | null> => {
  return await mutex.runExclusive(async () => {
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
        // Save new token to localStorage
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
        originalRequest.url?.includes("/auth/login") ||
        originalRequest.url?.includes("/auth/register");

      // Check: No retry (avoid infinite loop)
      const hasNoRetryHeader = originalRequest.headers?.[NO_RETRY_HEADER];

      if (!isAuthApi && !hasNoRetryHeader) {
        console.log("[Axios] Got 401, attempting token refresh...");

        // Call refresh token
        const newAccessToken = await handleRefreshToken();

        if (newAccessToken) {
          // Refresh successful - Update header and retry request
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            originalRequest.headers[NO_RETRY_HEADER] = "true"; // Đánh dấu đã retry
          }

          // Gửi lại request cũ với token mới
          console.log("[Axios] Retrying original request with new token...");
          return axiosInstance(originalRequest);
        } else {
          // Refresh thất bại - Gọi callback để xử lý
          console.log(
            "[Axios] Refresh token failed, calling callback..."
          );

          // Gọi callback thay vì dispatch trực tiếp (tránh circular dependency)
          if (onRefreshTokenFailed) {
            onRefreshTokenFailed(
              "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
            );
          }

          // Clear token - KHÔNG redirect ở đây (ClientLayout sẽ xử lý)
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

      // Clear token - KHÔNG redirect ở đây
      localStorage.removeItem("access_token");
    }

    // Trả về error cho các trường hợp khác
    return Promise.reject(error);
  }
);

export default axiosInstance;
