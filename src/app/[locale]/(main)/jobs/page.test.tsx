import { render, screen } from "@testing-library/react";
import JobsPage, { generateMetadata } from "./page";
import { fetchPublicJobSearch } from "@/lib/utils/public-content";

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
  fetchPublicJobSearch: jest.fn(),
  fetchPublicPopularSkills: jest.fn().mockResolvedValue(null),
}));

jest.mock("@/features/job/components/landing/landing-links", () => ({
  LandingLinks: () => <nav data-testid="landing-links" />,
}));

jest.mock("./jobs-page-client", () => ({
  __esModule: true,
  default: () => <div data-testid="jobs-page-client" />,
}));

const props = (searchParams: Record<string, string> = {}) => ({
  params: Promise.resolve({ locale: "vi" }),
  searchParams: Promise.resolve(searchParams),
});

const resultWithPages = (totalPages: number) => ({
  result: [],
  meta: {
    pagination: {
      current_page: 1,
      per_page: 10,
      total: totalPages * 10,
      total_pages: totalPages,
    },
  },
});

describe("JobsPage metadata", () => {
  it("indexes plain pagination with a self-canonical and the page in the title", async () => {
    const metadata = await generateMetadata(props({ page: "2" }));

    expect(metadata.robots).toBeUndefined();
    expect(metadata.alternates?.canonical).toBe(
      "http://localhost:3000/viec-lam?page=2"
    );
    expect(metadata.title).toBe('pagedTitle:{"title":"heroTitle","page":2}');
  });

  it("noindexes a search without pointing a canonical at /jobs", async () => {
    const metadata = await generateMetadata(props({ q: "react" }));

    expect(metadata.robots).toEqual({ index: false, follow: true });
    expect(metadata.alternates).toBeUndefined();
  });
});

describe("JobsPage", () => {
  it("answers 404 past the last page", async () => {
    jest
      .mocked(fetchPublicJobSearch)
      .mockResolvedValue(resultWithPages(3) as never);

    await expect(JobsPage(props({ page: "4" }))).rejects.toThrow(
      "NEXT_NOT_FOUND"
    );
  });

  it("still renders when the backend could not be reached", async () => {
    jest.mocked(fetchPublicJobSearch).mockResolvedValue(null);

    render(await JobsPage(props({ page: "4" })));

    expect(screen.getByTestId("jobs-page-client")).toBeInTheDocument();
  });
});
