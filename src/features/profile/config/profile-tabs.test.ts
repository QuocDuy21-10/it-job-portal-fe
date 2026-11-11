import {
  PROFILE_TABS,
  parseProfileTab,
} from "@/features/profile/config/profile-tabs";

describe("parseProfileTab", () => {
  it.each(PROFILE_TABS)("returns %s for a valid tab", (tab) => {
    expect(parseProfileTab(tab)).toBe(tab);
  });

  it.each([null, "", "abc", "Overview"])(
    "falls back to overview for %p",
    (value) => {
      expect(parseProfileTab(value)).toBe("overview");
    }
  );

  it("lists all seven profile tabs in menu order", () => {
    expect(PROFILE_TABS).toEqual([
      "overview",
      "my-cv",
      "create-cv",
      "my-jobs",
      "email-subscription",
      "notifications",
      "settings",
    ]);
  });
});
