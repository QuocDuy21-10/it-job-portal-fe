import { isSafeHttpUrl } from "./is-safe-http-url";

describe("isSafeHttpUrl", () => {
  it.each(["https://example.com/jobs/1", "http://example.com"])(
    "accepts %s",
    (url) => {
      expect(isSafeHttpUrl(url)).toBe(true);
    }
  );

  it.each([
    "javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "not a url",
    "",
    undefined,
    null,
  ])("rejects %s", (url) => {
    expect(isSafeHttpUrl(url)).toBe(false);
  });
});
