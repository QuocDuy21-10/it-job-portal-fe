import { AxiosError, type AxiosResponse } from "axios";
import axiosInstance from "@/lib/axios/axios-instance";
import { standaloneMessages } from "@/locales/standalone";
import { axiosBaseQuery } from "./axios-base-query";

jest.mock("@/lib/axios/axios-instance", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockAxios = axiosInstance as unknown as jest.Mock;

const rejectWith = (status: number, data: unknown) =>
  mockAxios.mockRejectedValueOnce(
    new AxiosError("Request failed", undefined, undefined, undefined, {
      status,
      data,
    } as AxiosResponse)
  );

const run = () =>
  axiosBaseQuery()({ url: "/auth/login" }, {} as any, {}) as Promise<{
    error?: { status?: number; data?: any };
  }>;

describe("axiosBaseQuery", () => {
  afterEach(() => {
    document.documentElement.lang = "";
  });

  it.each(["en", "vi"] as const)(
    "replaces the raw throttler message on 429 with a localized one (%s)",
    async (lang) => {
      document.documentElement.lang = lang;
      rejectWith(429, {
        statusCode: 429,
        message: "ThrottlerException: Too Many Requests",
      });

      const { error } = await run();

      expect(error?.status).toBe(429);
      expect(error?.data.message).toBe(
        standaloneMessages[lang].middleware.tooManyRequests
      );
    }
  );

  it("passes other API error messages through unchanged", async () => {
    rejectWith(401, {
      statusCode: 401,
      message: "Email or password is incorrect",
    });

    const { error } = await run();

    expect(error?.data.message).toBe("Email or password is incorrect");
  });
});
