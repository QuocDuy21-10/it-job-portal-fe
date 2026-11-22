import { buildLegalPageMetadata } from "./legal-page";

jest.mock("next-intl", () => ({ hasLocale: () => true }));

jest.mock("@/i18n/routing", () => ({
  routing: { locales: ["en", "vi"], defaultLocale: "en" },
}));

describe("buildLegalPageMetadata", () => {
  it.each(["privacy", "terms"] as const)(
    "keeps the draft %s page out of the index",
    (page) => {
      expect(buildLegalPageMetadata("vi", page).robots).toEqual({
        index: false,
        follow: true,
      });
    }
  );
});
