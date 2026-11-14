import { safeInternalPath } from "./safe-url";

const FALLBACK = "/fallback";

describe("safeInternalPath", () => {
  it.each(["/", "/profile", "/vi/profile", "/jobs?page=2"])(
    "keeps the internal path %s",
    (path) => {
      expect(safeInternalPath(path, FALLBACK)).toBe(path);
    }
  );

  it.each([
    "//evil.com",
    "/\\evil.com",
    "https://evil.com",
    "javascript:alert(1)",
    "profile",
    "/profile\n",
    "/\t/evil.com",
    "/profile\u007f",
    "",
    null,
    undefined,
  ])("falls back for %p", (value) => {
    expect(safeInternalPath(value, FALLBACK)).toBe(FALLBACK);
  });
});
