import { getPathname } from "./navigation";
import { companyHref, externalJobHref, jobHref, toAppHref } from "./hrefs";

const ID = "6af9ccda25a0db1ca69a68da";

describe("hrefs", () => {
  it("builds localized detail URLs with the slug", () => {
    const href = jobHref(ID, "Senior Backend Engineer (Go)");

    expect(getPathname({ href, locale: "vi" })).toBe(
      `/viec-lam/senior-backend-engineer-go-${ID}`
    );
    expect(getPathname({ href, locale: "en" })).toBe(
      `/en/jobs/senior-backend-engineer-go-${ID}`
    );
    expect(
      getPathname({ href: companyHref(ID, "FPT Software"), locale: "vi" })
    ).toBe(`/cong-ty/fpt-software-${ID}`);
  });

  it("falls back to the bare id when no name is known", () => {
    expect(getPathname({ href: jobHref(ID), locale: "vi" })).toBe(
      `/viec-lam/${ID}`
    );
  });

  it("keeps external job ids as they are", () => {
    expect(getPathname({ href: externalJobHref("ext-1"), locale: "vi" })).toBe(
      "/viec-lam/nguon-ngoai/ext-1"
    );
  });

  it("splits a static path with a query string", () => {
    expect(toAppHref("/profile?tab=my-cv")).toEqual({
      pathname: "/profile",
      query: { tab: "my-cv" },
    });
    expect(toAppHref("/jobs")).toBe("/jobs");
    expect(getPathname({ href: toAppHref("/jobs"), locale: "vi" })).toBe(
      "/viec-lam"
    );
  });
});
