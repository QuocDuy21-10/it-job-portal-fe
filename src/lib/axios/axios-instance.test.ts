import {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { getAccessTokenAsync, refreshAccessToken } from "@/lib/auth/session";
import axiosInstance from "./axios-instance";

jest.mock("@/lib/auth/session", () => ({
  getAccessTokenAsync: jest.fn(),
  refreshAccessToken: jest.fn(),
}));

jest.mock("@/shared/constants/constant", () => ({
  API_BASE_URL: "http://api.test/api/v1",
}));

const mockGetToken = getAccessTokenAsync as jest.MockedFunction<
  typeof getAccessTokenAsync
>;
const mockRefresh = refreshAccessToken as jest.MockedFunction<
  typeof refreshAccessToken
>;

type Reply = { status: number; data?: unknown };

const adapter = jest.fn<Promise<AxiosResponse>, [InternalAxiosRequestConfig]>();

const reply = (config: InternalAxiosRequestConfig, { status, data }: Reply) => {
  const response = {
    data: data ?? {},
    status,
    statusText: "",
    headers: {},
    config,
  } as AxiosResponse;
  return status >= 400
    ? Promise.reject(
        new AxiosError(
          "Request failed",
          AxiosError.ERR_BAD_REQUEST,
          config,
          null,
          response
        )
      )
    : Promise.resolve(response);
};

const queue = (...replies: Reply[]) => {
  replies.forEach((next) =>
    adapter.mockImplementationOnce((config) => reply(config, next))
  );
};

const sentHeader = (call: number, name: string) =>
  adapter.mock.calls[call][0].headers.get(name);

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("axiosInstance", () => {
  beforeAll(() => {
    axiosInstance.defaults.adapter = adapter;
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("attaches the bearer token and unwraps response data", async () => {
    mockGetToken.mockResolvedValue("token");
    queue({ status: 200, data: { ok: true } });

    await expect(axiosInstance.get("/jobs")).resolves.toEqual({ ok: true });
    expect(sentHeader(0, "Authorization")).toBe("Bearer token");
  });

  it("holds the request until a session restore finishes", async () => {
    let resolveToken: (token: string | null) => void = () => {};
    mockGetToken.mockReturnValue(
      new Promise((resolve) => {
        resolveToken = resolve;
      })
    );
    queue({ status: 200, data: { ok: true } });

    const pending = axiosInstance.get("/profile");
    await flush();
    expect(adapter).not.toHaveBeenCalled();

    resolveToken("restored");

    await expect(pending).resolves.toEqual({ ok: true });
    expect(sentHeader(0, "Authorization")).toBe("Bearer restored");
  });

  it("refreshes once on 401 and retries with the new token", async () => {
    mockGetToken.mockResolvedValueOnce("old").mockResolvedValue("new");
    mockRefresh.mockResolvedValue("new");
    queue({ status: 401 }, { status: 200, data: { ok: true } });

    await expect(axiosInstance.get("/jobs")).resolves.toEqual({ ok: true });
    expect(mockRefresh).toHaveBeenCalledTimes(1);
    expect(adapter).toHaveBeenCalledTimes(2);
    expect(sentHeader(1, "Authorization")).toBe("Bearer new");
    expect(sentHeader(1, "x-no-retry")).toBe("true");
  });

  it("does not refresh for a guest request", async () => {
    mockGetToken.mockResolvedValue(null);
    queue({ status: 401 });

    await expect(axiosInstance.get("/jobs")).rejects.toMatchObject({
      response: { status: 401 },
    });
    expect(mockRefresh).not.toHaveBeenCalled();
  });

  it("does not refresh for a failed login", async () => {
    mockGetToken.mockResolvedValue("token");
    queue({ status: 401 });

    await expect(axiosInstance.post("/auth/login", {})).rejects.toMatchObject({
      response: { status: 401 },
    });
    expect(mockRefresh).not.toHaveBeenCalled();
  });

  it("rejects the original error when refresh fails", async () => {
    mockGetToken.mockResolvedValue("old");
    mockRefresh.mockResolvedValue(null);
    queue({ status: 401 });

    await expect(axiosInstance.get("/jobs")).rejects.toMatchObject({
      response: { status: 401 },
    });
    expect(adapter).toHaveBeenCalledTimes(1);
  });

  it("gives up when the retried request is still unauthorized", async () => {
    mockGetToken.mockResolvedValue("old");
    mockRefresh.mockResolvedValue("new");
    queue({ status: 401 }, { status: 401 });

    await expect(axiosInstance.get("/jobs")).rejects.toMatchObject({
      response: { status: 401 },
    });
    expect(mockRefresh).toHaveBeenCalledTimes(1);
    expect(adapter).toHaveBeenCalledTimes(2);
  });
});
