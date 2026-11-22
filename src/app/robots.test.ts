import robots from "./robots";

jest.mock("@/i18n/routing", () => ({
  routing: { locales: ["en", "vi"], defaultLocale: "en" },
}));

describe("robots.txt", () => {
  it("blocks only /api/ and points to the sitemap", () => {
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/", disallow: "/api/" },
      sitemap: "http://localhost:3000/sitemap.xml",
    });
  });
});
