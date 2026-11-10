import {
  isNavActive,
  LANGUAGES,
  MAIN_NAV_ITEMS,
  USER_MENU_ITEMS,
} from "./nav-config";

describe("isNavActive", () => {
  it.each([
    ["/jobs", "/jobs", true],
    ["/jobs/abc", "/jobs", true],
    ["/jobs/external/1", "/jobs", true],
    ["/jobsearch", "/jobs", false],
    ["/companies", "/jobs", false],
    ["/", "/jobs", false],
  ])("pathname %s vs href %s -> %s", (pathname, href, expected) => {
    expect(isNavActive(pathname, href)).toBe(expected);
  });
});

describe("header nav config", () => {
  it("keeps the main nav order", () => {
    expect(MAIN_NAV_ITEMS.map((item) => item.href)).toEqual([
      "/jobs",
      "/companies",
    ]);
  });

  it("keeps the user menu order and marks only /admin as admin-only", () => {
    expect(USER_MENU_ITEMS.map((item) => item.href)).toEqual([
      "/profile?tab=overview",
      "/admin",
      "/profile?tab=my-cv",
      "/profile?tab=create-cv",
      "/profile?tab=my-jobs",
      "/profile?tab=email-subscription",
      "/profile?tab=notifications",
      "/profile?tab=settings",
    ]);
    expect(
      USER_MENU_ITEMS.filter((item) => item.adminOnly).map((item) => item.href)
    ).toEqual(["/admin"]);
  });

  it("lists the supported languages", () => {
    expect(LANGUAGES.map((lang) => lang.code)).toEqual(["en", "vi"]);
  });
});
