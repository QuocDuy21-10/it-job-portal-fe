import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "@/shared/constants/constant";
import { getAccessTokenAsync, refreshAccessToken } from "@/lib/auth/session";

// Custom header to avoid infinite retries
const NO_RETRY_HEADER = "x-no-retry";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

const isCredentialsEndpoint = (url = "") =>
  url.includes("/login") || url.includes("/register");

// Request Interceptor: waits for a session restore or refresh in flight, then adds the token
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const accessToken = await getAccessTokenAsync();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Set Content-Type for JSON requests only (not for FormData)
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  }
);

// Response Interceptor: unwrap data; on 401 refresh once (shared across requests) and retry
axiosInstance.interceptors.response.use(
  (response: any) => response.data,
  async (error: AxiosError) => {
    const request = error.config;

    // Only a request that carried a token can be rescued by a refresh; a guest 401 is final.
    if (
      error.response?.status !== 401 ||
      !request ||
      isCredentialsEndpoint(request.url) ||
      request.headers[NO_RETRY_HEADER] ||
      !request.headers.Authorization
    ) {
      return Promise.reject(error);
    }

    const newAccessToken = await refreshAccessToken();
    if (!newAccessToken) {
      return Promise.reject(error);
    }

    request.headers.Authorization = `Bearer ${newAccessToken}`;
    request.headers[NO_RETRY_HEADER] = "true";
    return axiosInstance(request);
  }
);

export default axiosInstance;
