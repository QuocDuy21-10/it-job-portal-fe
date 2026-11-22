import { API_BASE_URL, API_BASE_URL_IMAGE } from "./constant";
import { buildLocalizedPageMetadata, getSiteUrl } from "./seo";

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
    href: "/jobs" as const,
    title: "Việc làm IT mới nhất",
    description: "d",
  };

  it("gives indexable pages a canonical, hreflang and the default share image", () => {
    const metadata = buildLocalizedPageMetadata(base);

    expect(metadata.robots).toBeUndefined();
    expect(metadata.alternates?.canonical).toBe(
      "http://localhost:3000/viec-lam"
    );
    expect(metadata.alternates?.languages).toEqual({
      vi: "http://localhost:3000/viec-lam",
      en: "http://localhost:3000/en/jobs",
      "x-default": "http://localhost:3000/viec-lam",
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

  it("translates dynamic routes and keeps query strings", () => {
    const metadata = buildLocalizedPageMetadata({
      ...base,
      locale: "en",
      href: { pathname: "/jobs", query: { page: "2" } },
    });

    expect(metadata.alternates?.canonical).toBe(
      "http://localhost:3000/en/jobs?page=2"
    );
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
