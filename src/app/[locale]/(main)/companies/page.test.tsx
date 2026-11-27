import CompaniesPage, { generateMetadata } from "./page";
import { fetchPublicCompanies } from "@/lib/utils/public-content";

jest.mock("next-intl", () => ({
  ...jest.requireActual("next-intl"),
  hasLocale: () => true,
}));

jest.mock("next-intl/server", () => ({
  getTranslations: jest.fn(
    async () => (key: string, values?: Record<string, unknown>) =>
      values ? `${key}:${JSON.stringify(values)}` : key
  ),
}));

jest.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

jest.mock("@/lib/utils/public-content", () => ({
  fetchPublicCompanies: jest.fn(),
  fetchPublicTopHiringCompanies: jest.fn().mockResolvedValue(null),
}));

jest.mock("./companies-page-client", () => ({
  __esModule: true,
  default: () => <div data-testid="companies-page-client" />,
}));

const props = (searchParams: Record<string, string> = {}) => ({
  params: Promise.resolve({ locale: "en" }),
  searchParams: Promise.resolve(searchParams),
});

describe("CompaniesPage", () => {
  it("titles the list and noindexes a company search", async () => {
    expect((await generateMetadata(props())).title).toBe("companiesTitle");

    const searched = await generateMetadata(props({ q: "fpt" }));

    expect(searched.robots).toEqual({ index: false, follow: true });
    expect(searched.alternates).toBeUndefined();
  });

  it("answers 404 past the last page", async () => {
    jest.mocked(fetchPublicCompanies).mockResolvedValue({
      result: [],
      meta: {
        pagination: { current_page: 1, per_page: 9, total: 20, total_pages: 3 },
      },
    } as never);

    await expect(CompaniesPage(props({ page: "4" }))).rejects.toThrow(
      "NEXT_NOT_FOUND"
    );
  });
});
