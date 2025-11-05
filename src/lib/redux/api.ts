import { API_BASE_URL } from "@/shared/constants/constant";
import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";

// Create a mutex to prevent multiple refresh token calls
const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "include", // Important for sending cookies (refresh token)
  prepareHeaders: (headers) => {
    // Add access token to headers if available
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }
    return headers;
  },
});

// Base query with automatic token refresh
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Wait until the mutex is available without locking it
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  // If we get a 401 error, try to refresh the token
  if (result.error && result.error.status === 401) {
    // Check if the mutex is locked (another refresh is in progress)
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        console.log("Access token expired, attempting to refresh...");

        // Try to refresh the token
        const refreshResult = await baseQuery(
          {
            url: "/auth/refresh",
            method: "POST",
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          // Extract the new access token from the response
          const data = refreshResult.data as {
            data?: { access_token?: string };
          };
          const newAccessToken = data?.data?.access_token;

          if (newAccessToken) {
            // Store the new token
            if (typeof window !== "undefined") {
              localStorage.setItem("access_token", newAccessToken);
            }

            console.log(
              "Token refreshed successfully, retrying original request..."
            );

            // Retry the original request with the new token
            result = await baseQuery(args, api, extraOptions);
          } else {
            console.error("Refresh token response missing access_token");
            handleLogout();
          }
        } else {
          // Refresh failed - logout user
          console.error("Refresh token failed:", refreshResult.error);
          handleLogout();
        }
      } finally {
        // Release the mutex
        release();
      }
    } else {
      // Wait for the mutex to be unlocked and retry the request
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

// Helper function to handle logout
const handleLogout = () => {
  if (typeof window !== "undefined") {
    // Clear tokens
    localStorage.removeItem("access_token");

    // Dispatch logout action if needed
    // This will be handled by Redux when the 401 error propagates

    // Redirect to login page
    window.location.href = "/auth/login";
  }
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,

  // Define tag types for cache invalidation
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
