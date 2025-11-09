import { BaseQueryFn } from "@reduxjs/toolkit/query";
import axiosInstance from "@/lib/axios/axios-instance";
import { AxiosError, AxiosRequestConfig } from "axios";

interface AxiosBaseQueryArgs {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
  headers?: AxiosRequestConfig["headers"];
}

export const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: "" }
  ): BaseQueryFn<
    string | AxiosBaseQueryArgs,
    unknown,
    {
      status?: number;
      data?: any;
      message?: string;
    }
  > =>
  async (args) => {
    try {
      // Handle string or object args
      const requestConfig: AxiosRequestConfig =
        typeof args === "string"
          ? { url: baseUrl + args, method: "GET" }
          : {
              url: baseUrl + args.url,
              method: args.method || "GET",
              data: args.data,
              params: args.params,
              headers: args.headers,
            };

      const result = await axiosInstance(requestConfig);
      return { data: result };
    } catch (axiosError) {
      const err = axiosError as AxiosError;

      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
          message: err.message,
        },
      };
    }
  };
