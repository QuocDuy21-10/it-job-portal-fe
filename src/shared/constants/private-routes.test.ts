import { isPrivatePath } from "./private-routes";

jest.mock("@/i18n/routing", () => ({
  routing: { locales: ["en", "vi"], defaultLocale: "en" },
}));

describe("isPrivatePath", () => {
  it.each([
    "/admin",
    "/admin/users",
    "/vi/admin",
    "/hr/dashboard",
    "/vi/login",
    "/register",
    "/profile",
    "/profile/cv-preview",
    "/account/cancel-deletion",
  ])("%s is private", (pathname) => {
    expect(isPrivatePath(pathname)).toBe(true);
  });

  it.each([
    "/",
    "/vi",
    "/jobs",
    "/vi/jobs/abc",
    "/companies",
    "/administrator",
    "/hrm",
  ])("%s is public", (pathname) => {
    expect(isPrivatePath(pathname)).toBe(false);
  });
});
