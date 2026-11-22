import { API_BASE_URL, API_BASE_URL_IMAGE } from "./constant";
import { buildLocalizedPageMetadata, getSiteUrl } from "./seo";

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

describe("buildLocalizedPageMetadata", () => {
  const base = {
    locale: "vi" as const,
    pathname: "/jobs",
    title: "Việc làm IT mới nhất",
    description: "d",
  };

  it("gives indexable pages a canonical, hreflang and the default share image", () => {
    const metadata = buildLocalizedPageMetadata(base);

    expect(metadata.robots).toBeUndefined();
    expect(metadata.alternates?.canonical).toBe(
      "http://localhost:3000/vi/jobs"
    );
    expect(metadata.alternates?.languages).toEqual({
      en: "http://localhost:3000/jobs",
      vi: "http://localhost:3000/vi/jobs",
      "x-default": "http://localhost:3000/jobs",
    });
    expect(metadata.openGraph?.images).toEqual([
      {
        url: "http://localhost:3000/images/og-default.png",
        width: 1200,
        height: 630,
        alt: base.title,
      },
    ]);
  });

  it("noindexes non-indexable pages and drops canonical and hreflang", () => {
    const metadata = buildLocalizedPageMetadata({ ...base, indexable: false });

    expect(metadata.robots).toEqual({ index: false, follow: true });
    expect(metadata.alternates).toBeUndefined();
  });

  it("uses the page's own image when it has one", () => {
    const metadata = buildLocalizedPageMetadata({
      ...base,
      ogImage: "https://api.example.com/logo.png",
    });

    expect(metadata.openGraph?.images).toEqual([
      { url: "https://api.example.com/logo.png" },
    ]);
  });
});
