/**
 * @jest-environment node
 */
import { renderToStaticMarkup } from "react-dom/server";
import { fetchPublicLegalPage } from "@/lib/utils/public-content";
import { LegalPage, buildLegalPageMetadata } from "./legal-page";

jest.mock("next-intl", () => ({
  ...jest.requireActual("next-intl"),
  hasLocale: () => true,
}));
jest.mock("next-intl/server", () => ({
  getTranslations: async () => (key: string) => key,
}));
jest.mock("next/server", () => ({ connection: async () => undefined }));
jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  notFound: () => {
    throw new Error("NOT_FOUND");
  },
}));
jest.mock("@/lib/utils/public-content", () => ({
  fetchPublicLegalPage: jest.fn(),
}));

const fetchMock = fetchPublicLegalPage as jest.Mock;
const page = (overrides = {}) => ({
  page: "terms",
  locale: "vi",
  title: "Điều khoản",
  description: "Mô tả",
  contentHtml: "<h2>Mục 1</h2><p>Nội dung</p><script>alert(1)</script>",
  isPublished: false,
  updatedAt: "2026-11-14T00:00:00.000Z",
  ...overrides,
});
const render = async () =>
  renderToStaticMarkup(await LegalPage({ locale: "vi", page: "terms" }));

describe("legal page", () => {
  it("keeps a draft out of the index and labels it", async () => {
    fetchMock.mockResolvedValue(page());

    expect((await buildLegalPageMetadata("vi", "terms")).robots).toEqual({
      index: false,
      follow: true,
    });
    expect(await render()).toContain("draftNotice");
  });

  it("indexes a published page without the notice", async () => {
    fetchMock.mockResolvedValue(page({ isPublished: true }));

    expect(
      (await buildLegalPageMetadata("vi", "terms")).robots
    ).toBeUndefined();
    expect(await render()).not.toContain("draftNotice");
  });

  it("renders the text without scripts", async () => {
    fetchMock.mockResolvedValue(page());

    const html = await render();
    expect(html).toContain("<h2>Mục 1</h2>");
    expect(html).not.toContain("alert(1)");
  });

  it("answers 404 when the page was never written", async () => {
    fetchMock.mockResolvedValue(null);

    await expect(render()).rejects.toThrow("NOT_FOUND");
  });
});
