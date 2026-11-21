import { defineAbilityFor } from "@/lib/casl/ability";
import { canOpenAdminPath } from "./admin-route";

jest.mock("next-intl", () => ({ useLocale: () => "en" }));
jest.mock("@/i18n/navigation", () => ({
  getPathname: jest.fn(),
  usePathname: jest.fn(),
}));

describe("canOpenAdminPath", () => {
  const hr = defineAbilityFor("HR");
  const admin = defineAbilityFor("SUPER ADMIN");

  it("blocks HR from SUPER ADMIN-only pages", () => {
    expect(canOpenAdminPath("/admin/users", hr)).toBe(false);
    expect(canOpenAdminPath("/admin/users/123", hr)).toBe(false);
  });

  it("lets HR open the pages its role can read", () => {
    for (const path of [
      "/admin",
      "/admin/jobs",
      "/admin/companies",
      "/admin/resumes",
    ]) {
      expect(canOpenAdminPath(path, hr)).toBe(true);
    }
  });

  it("lets HR open pages that are not in the admin navigation", () => {
    expect(canOpenAdminPath("/admin/change-password", hr)).toBe(true);
  });

  it("lets SUPER ADMIN open every admin page", () => {
    expect(canOpenAdminPath("/admin/users", admin)).toBe(true);
  });
});
