import { buildLegalPageMetadata } from "./legal-page";

jest.mock("next-intl", () => ({
  ...jest.requireActual("next-intl"),
  hasLocale: () => true,
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
