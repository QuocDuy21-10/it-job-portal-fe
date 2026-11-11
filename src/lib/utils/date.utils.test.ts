import {
  formatChatTimestamp,
  formatRelativeTime,
  isWithinMinutes,
} from "./date.utils";

describe("date.utils", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date(2024, 10, 20, 15, 0, 0));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("formatRelativeTime", () => {
    const fiveMinutesAgo = new Date(2024, 10, 20, 14, 55, 0);

    it("formats in English by default", () => {
      expect(formatRelativeTime(fiveMinutesAgo)).toBe("5 minutes ago");
    });

    it("formats in Vietnamese for the vi locale", () => {
      expect(formatRelativeTime(fiveMinutesAgo, "vi")).toContain("trước");
    });

    it("accepts ISO strings and returns '' for invalid input", () => {
      expect(formatRelativeTime(fiveMinutesAgo.toISOString())).toBe(
        "5 minutes ago"
      );
      expect(formatRelativeTime("not-a-date")).toBe("");
    });
  });

  describe("formatChatTimestamp", () => {
    it("shows only the time for today", () => {
      expect(formatChatTimestamp(new Date(2024, 10, 20, 14, 30))).toBe("14:30");
    });

    it("prefixes yesterday", () => {
      expect(formatChatTimestamp(new Date(2024, 10, 19, 14, 30))).toBe(
        "Hôm qua 14:30"
      );
    });

    it("shows the full date for older timestamps and '' for invalid input", () => {
      expect(formatChatTimestamp(new Date(2024, 10, 1, 9, 5))).toBe(
        "01/11/2024 09:05"
      );
      expect(formatChatTimestamp("not-a-date")).toBe("");
    });
  });

  describe("isWithinMinutes", () => {
    it("is true inside the window and false outside it", () => {
      expect(isWithinMinutes(new Date(2024, 10, 20, 14, 55), 10)).toBe(true);
      expect(isWithinMinutes(new Date(2024, 10, 20, 14, 30), 10)).toBe(false);
    });
  });
});
