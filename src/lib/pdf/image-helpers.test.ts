import { getProxiedImageUrl } from "./image-helpers";

describe("getProxiedImageUrl", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("returns undefined when imageUrl is falsy", () => {
    expect(getProxiedImageUrl(undefined)).toBeUndefined();
    expect(getProxiedImageUrl("")).toBeUndefined();
  });

  it("returns data URIs as-is", () => {
    const dataUri = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    expect(getProxiedImageUrl(dataUri)).toBe(dataUri);
  });

  it("returns relative URLs starting with / as-is", () => {
    expect(getProxiedImageUrl("/images/avatar.png")).toBe("/images/avatar.png");
  });

  it("proxies backend URL matching localhost:8081", () => {
    const imageUrl = "http://localhost:8081/images/avatar/123.png";
    const expected = "/api/proxy-image?url=" + encodeURIComponent(imageUrl);
    expect(getProxiedImageUrl(imageUrl)).toBe(expected);
  });

  it("proxies backend URL matching NEXT_PUBLIC_API_URL", () => {
    process.env.NEXT_PUBLIC_API_URL = "http://api.jobportal.local";
    const imageUrl = "http://api.jobportal.local/images/avatar/123.png";
    const expected = "/api/proxy-image?url=" + encodeURIComponent(imageUrl);
    expect(getProxiedImageUrl(imageUrl)).toBe(expected);
  });

  it("proxies backend URL matching NEXT_PUBLIC_API_URL when protocol is omitted in config", () => {
    process.env.NEXT_PUBLIC_API_URL = "api.jobportal.local/api/v1";
    const imageUrl = "http://api.jobportal.local/images/avatar/123.png";
    const expected = "/api/proxy-image?url=" + encodeURIComponent(imageUrl);
    expect(getProxiedImageUrl(imageUrl)).toBe(expected);
  });

  it("does not crash and returns external URLs as-is when NEXT_PUBLIC_API_URL is undefined", () => {
    delete process.env.NEXT_PUBLIC_API_URL;
    const externalUrl = "https://lh3.googleusercontent.com/a/ACg8ocJ_ipmdfD1N8EaBIQhIY39s8iRRvPwGsar3766y-ShRtzSQUg=s96-c";
    expect(getProxiedImageUrl(externalUrl)).toBe(externalUrl);
  });

  it("returns external URLs as-is if they do not match localhost:8081 or NEXT_PUBLIC_API_URL", () => {
    process.env.NEXT_PUBLIC_API_URL = "http://api.jobportal.local";
    const externalUrl = "https://lh3.googleusercontent.com/a/ACg8ocJ_ipmdfD1N8EaBIQhIY39s8iRRvPwGsar3766y-ShRtzSQUg=s96-c";
    expect(getProxiedImageUrl(externalUrl)).toBe(externalUrl);
  });

  it("handles completely invalid URLs by returning undefined instead of throwing", () => {
    // Suppress console.error in tests for expected invalid URL logging
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    
    expect(getProxiedImageUrl("http://:")).toBeUndefined();
    
    spy.mockRestore();
  });
});
