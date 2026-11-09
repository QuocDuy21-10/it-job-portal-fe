import { parseEnv } from "./env";

const PROD_OK = {
  NEXT_PUBLIC_API_URL: "https://api.example.com",
  NEXT_PUBLIC_SITE_URL: "https://devlink.example.com",
};

describe("parseEnv", () => {
  it("falls back to local defaults outside production", () => {
    expect(parseEnv({}, "development")).toEqual({
      API_URL: "http://localhost:8081",
      SITE_URL: "http://localhost:3000",
      GOOGLE_CLIENT_ID: undefined,
    });
    expect(parseEnv({}, "test").API_URL).toBe("http://localhost:8081");
  });

  it("requires NEXT_PUBLIC_API_URL in production", () => {
    expect(() =>
      parseEnv(
        { NEXT_PUBLIC_SITE_URL: PROD_OK.NEXT_PUBLIC_SITE_URL },
        "production"
      )
    ).toThrow(/NEXT_PUBLIC_API_URL/);
  });

  it("requires NEXT_PUBLIC_SITE_URL in production", () => {
    expect(() =>
      parseEnv(
        { NEXT_PUBLIC_API_URL: PROD_OK.NEXT_PUBLIC_API_URL },
        "production"
      )
    ).toThrow(/NEXT_PUBLIC_SITE_URL/);
  });

  it("treats blank values as missing", () => {
    expect(() =>
      parseEnv({ ...PROD_OK, NEXT_PUBLIC_API_URL: "   " }, "production")
    ).toThrow(/NEXT_PUBLIC_API_URL/);
    expect(parseEnv({ NEXT_PUBLIC_API_URL: "" }, "development").API_URL).toBe(
      "http://localhost:8081"
    );
  });

  it("normalizes to an origin and strips the trailing slash", () => {
    const parsed = parseEnv(
      {
        NEXT_PUBLIC_API_URL: "https://API.example.com/",
        NEXT_PUBLIC_SITE_URL: "https://devlink.example.com/",
      },
      "production"
    );
    expect(parsed.API_URL).toBe("https://api.example.com");
    expect(parsed.SITE_URL).toBe("https://devlink.example.com");
  });

  it("keeps a non-default port", () => {
    expect(
      parseEnv({ NEXT_PUBLIC_API_URL: "http://localhost:9000" }, "development")
        .API_URL
    ).toBe("http://localhost:9000");
  });

  it.each([
    ["a path", "https://api.example.com/api/v1"],
    ["a query", "https://api.example.com?x=1"],
    ["a hash", "https://api.example.com#x"],
    ["a non-http scheme", "ftp://api.example.com"],
    ["no scheme", "api.example.com"],
    ["garbage", "not a url"],
  ])(
    "rejects NEXT_PUBLIC_API_URL with %s (even outside production)",
    (_n, value) => {
      expect(() =>
        parseEnv({ NEXT_PUBLIC_API_URL: value }, "development")
      ).toThrow(/NEXT_PUBLIC_API_URL/);
      expect(() =>
        parseEnv({ ...PROD_OK, NEXT_PUBLIC_API_URL: value }, "production")
      ).toThrow(/NEXT_PUBLIC_API_URL/);
    }
  );

  it("passes the optional Google client id through", () => {
    expect(
      parseEnv(
        { ...PROD_OK, NEXT_PUBLIC_GOOGLE_CLIENT_ID: "abc" },
        "production"
      ).GOOGLE_CLIENT_ID
    ).toBe("abc");
  });
});
