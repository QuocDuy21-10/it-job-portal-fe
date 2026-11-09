import { getProxiedImageUrl } from "./image-helpers";

describe("getProxiedImageUrl", () => {
  it("returns undefined when imageUrl is falsy", () => {
    expect(getProxiedImageUrl(undefined)).toBeUndefined();
    expect(getProxiedImageUrl("")).toBeUndefined();
  });

  it("returns data URIs as-is", () => {
    const dataUri =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    expect(getProxiedImageUrl(dataUri)).toBe(dataUri);
  });

  it("returns relative URLs starting with / as-is", () => {
    expect(getProxiedImageUrl("/images/avatar.png")).toBe("/images/avatar.png");
  });

  it("proxies URLs on the configured backend origin", () => {
    const imageUrl = "http://localhost:8081/images/avatar/123.png";
    expect(getProxiedImageUrl(imageUrl)).toBe(
      "/api/proxy-image?url=" + encodeURIComponent(imageUrl)
    );
  });

  it("honours a different configured backend origin", () => {
    jest.isolateModules(() => {
      jest.doMock("@/shared/config/env", () => ({
        env: { API_URL: "https://api.jobportal.local" },
      }));
      const { getProxiedImageUrl: proxied } = require("./image-helpers");
      const imageUrl = "https://api.jobportal.local/images/avatar/123.png";
      expect(proxied(imageUrl)).toBe(
        "/api/proxy-image?url=" + encodeURIComponent(imageUrl)
      );
      // the old localhost default is no longer special
      expect(proxied("http://localhost:8081/images/a.png")).toBe(
        "http://localhost:8081/images/a.png"
      );
    });
  });

  it("returns external URLs as-is", () => {
    const externalUrl =
      "https://lh3.googleusercontent.com/a/ACg8ocJ_ipmdfD1N8EaBIQhIY39s8iRRvPwGsar3766y-ShRtzSQUg=s96-c";
    expect(getProxiedImageUrl(externalUrl)).toBe(externalUrl);
  });

  it("handles completely invalid URLs by returning undefined instead of throwing", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(getProxiedImageUrl("http://:")).toBeUndefined();
    spy.mockRestore();
  });
});
