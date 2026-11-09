import { API_BASE_URL, API_BASE_URL_IMAGE } from "./constant";
import { getSiteUrl } from "./seo";

// next-intl ships ESM that Jest cannot parse; seo.ts only needs the locale list.
jest.mock("@/i18n/routing", () => ({
  routing: { locales: ["en", "vi"], defaultLocale: "en" },
}));

describe("env-derived constants", () => {
  it("builds API urls from the configured origin", () => {
    expect(API_BASE_URL).toBe("http://localhost:8081/api/v1");
    expect(API_BASE_URL_IMAGE).toBe("http://localhost:8081");
  });

  it("builds the site URL with a trailing slash", () => {
    expect(getSiteUrl().href).toBe("http://localhost:3000/");
  });
});
