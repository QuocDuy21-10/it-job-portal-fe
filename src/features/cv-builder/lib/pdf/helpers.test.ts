import { formatDateForDisplay } from "./helpers";

describe("formatDateForDisplay", () => {
  it("shows Present for a missing or blank date", () => {
    expect(formatDateForDisplay(undefined)).toBe("Present");
    expect(formatDateForDisplay("")).toBe("Present");
    expect(formatDateForDisplay("   ")).toBe("Present");
  });

  it("formats a date string as month and year", () => {
    expect(formatDateForDisplay("2020-01-15")).toMatch(/01.*2020/);
  });

  it("keeps text that is not a date instead of printing Invalid Date", () => {
    expect(formatDateForDisplay("Present")).toBe("Present");
    expect(formatDateForDisplay("Hiện tại")).toBe("Hiện tại");
  });

  it("shows Present for an invalid Date object", () => {
    expect(formatDateForDisplay(new Date("not a date"))).toBe("Present");
  });
});
