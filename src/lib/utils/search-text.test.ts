import { normalizeSearchText } from "./search-text";

it("ignores case, diacritics and extra spaces", () => {
  expect(normalizeSearchText("  Đà   Nẵng ")).toBe("da nang");
});
