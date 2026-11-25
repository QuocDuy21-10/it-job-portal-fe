import { toDateOnly } from "./locale-formatters";

it("keeps the local calendar day", () => {
  expect(toDateOnly(new Date(2026, 11, 15))).toBe("2026-12-15");
  expect(toDateOnly(undefined)).toBe("");
});
