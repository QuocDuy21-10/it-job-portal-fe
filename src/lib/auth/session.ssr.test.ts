/**
 * @jest-environment node
 */
import {
  endSession,
  getAccessToken,
  getAccessTokenAsync,
  hasSession,
  setAccessToken,
} from "./session";

jest.mock("@/shared/constants/constant", () => ({
  API_BASE_URL: "http://api.test/api/v1",
}));

describe("session without a browser", () => {
  it("never reports a session and never restores", async () => {
    expect(hasSession()).toBe(false);
    await expect(getAccessTokenAsync()).resolves.toBeNull();
  });

  it("keeps an in-memory token without touching storage", () => {
    setAccessToken("token");
    expect(getAccessToken()).toBe("token");

    endSession();
    expect(getAccessToken()).toBeNull();
  });
});
