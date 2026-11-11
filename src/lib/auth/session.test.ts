import axios from "axios";
import {
  endSession,
  getAccessToken,
  onSessionExpired,
  refreshAccessToken,
  SESSION_EXPIRED_MESSAGE,
  setAccessToken,
} from "./session";

jest.mock("@/shared/constants/constant", () => ({
  API_BASE_URL: "http://api.test/api/v1",
}));

const refreshResponse = (token: string) => ({
  data: { data: { access_token: token } },
});

describe("session", () => {
  let getSpy: jest.SpyInstance;
  let expired: jest.Mock;

  beforeEach(() => {
    endSession();
    expired = jest.fn();
    onSessionExpired(expired);
    getSpy = jest.spyOn(axios, "get");
  });

  afterEach(() => {
    getSpy.mockRestore();
  });

  it("stores the token under the existing localStorage key", () => {
    setAccessToken("token-1");

    expect(getAccessToken()).toBe("token-1");
    expect(localStorage.getItem("access_token")).toBe("token-1");

    endSession();

    expect(getAccessToken()).toBeNull();
    expect(localStorage.getItem("access_token")).toBeNull();
  });

  it("shares one /auth/refresh request between concurrent callers", async () => {
    setAccessToken("old");
    getSpy.mockResolvedValue(refreshResponse("new"));

    const results = await Promise.all(
      Array.from({ length: 5 }, () => refreshAccessToken())
    );

    expect(getSpy).toHaveBeenCalledTimes(1);
    expect(getSpy).toHaveBeenCalledWith("http://api.test/api/v1/auth/refresh", {
      withCredentials: true,
    });
    expect(results).toEqual(["new", "new", "new", "new", "new"]);
    expect(getAccessToken()).toBe("new");
  });

  it("starts a fresh request once the previous refresh has settled", async () => {
    setAccessToken("old");
    getSpy
      .mockResolvedValueOnce(refreshResponse("first"))
      .mockResolvedValueOnce(refreshResponse("second"));

    await expect(refreshAccessToken()).resolves.toBe("first");
    await expect(refreshAccessToken()).resolves.toBe("second");
    expect(getSpy).toHaveBeenCalledTimes(2);
  });

  it("discards a refresh that finishes after the session ended", async () => {
    let resolveRefresh: (value: unknown) => void = () => {};
    getSpy.mockReturnValue(
      new Promise((resolve) => {
        resolveRefresh = resolve;
      })
    );
    setAccessToken("old");

    const pending = refreshAccessToken();
    endSession();
    resolveRefresh(refreshResponse("revived"));

    await expect(pending).resolves.toBeNull();
    expect(getAccessToken()).toBeNull();
    expect(expired).not.toHaveBeenCalled();
  });

  it("reports an expired session once when refresh fails for a signed-in user", async () => {
    setAccessToken("old");
    getSpy.mockRejectedValue(new Error("400"));

    const results = await Promise.all([
      refreshAccessToken(),
      refreshAccessToken(),
      refreshAccessToken(),
    ]);

    expect(results).toEqual([null, null, null]);
    expect(expired).toHaveBeenCalledTimes(1);
    expect(expired).toHaveBeenCalledWith(SESSION_EXPIRED_MESSAGE);
  });

  it("treats a response without access_token as a failed refresh", async () => {
    setAccessToken("old");
    getSpy.mockResolvedValue({ data: { data: {} } });

    await expect(refreshAccessToken()).resolves.toBeNull();
    expect(expired).toHaveBeenCalledTimes(1);
  });

  it("stays silent when refresh fails and there was no token", async () => {
    getSpy.mockRejectedValue(new Error("401"));

    await expect(refreshAccessToken()).resolves.toBeNull();
    expect(expired).not.toHaveBeenCalled();
  });
});
