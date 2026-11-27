import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { createLandingRoute } from "./landing-route";
import { fetchPublicJobSearchStrict } from "@/lib/utils/public-content";

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
  ...jest.requireActual("next/navigation"),
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));
jest.mock("@/lib/utils/public-content", () => ({
  fetchPublicJobSearchStrict: jest.fn(),
}));
jest.mock("@/features/job/components/job-card", () => ({
  JobCard: ({ data }: { data: { title: string } }) => (
    <div data-testid="card">{data.title}</div>
  ),
}));
jest.mock("@/i18n/navigation", () => ({
  ...jest.requireActual("@/i18n/navigation"),
  Link: ({ href, children }: { href: unknown; children: ReactNode }) => (
    <a href={typeof href === "string" ? href : JSON.stringify(href)}>
      {children}
    </a>
  ),
}));

const route = createLandingRoute("skill");
const H1 = 'landingPage.h1Skill:{"name":"React"}';

const props = (skill: string, searchParams: Record<string, string> = {}) => ({
  params: Promise.resolve({ locale: "vi", skill }),
  searchParams: Promise.resolve(searchParams),
});

const result = (total: number, companies: string[] = []) => ({
  result: companies.map((companyName, index) => ({
    id: `j${index}`,
    title: `Job ${index}`,
    companyName,
  })),
  meta: {
    pagination: {
      current_page: 1,
      per_page: 20,
      total,
      total_pages: Math.max(1, Math.ceil(total / 20)),
    },
  },
});

describe("createLandingRoute", () => {
  beforeEach(() => jest.mocked(fetchPublicJobSearchStrict).mockReset());

  it("queries the backend with the skill filter", async () => {
    jest
      .mocked(fetchPublicJobSearchStrict)
      .mockResolvedValue(result(12) as never);

    await route.generateMetadata(props("react"));

    expect(fetchPublicJobSearchStrict).toHaveBeenCalledWith({
      skills: "React",
      sort: "newest",
      page: 1,
      limit: 20,
    });
  });

  it("indexes pages with enough jobs and noindexes thin ones", async () => {
    jest
      .mocked(fetchPublicJobSearchStrict)
      .mockResolvedValue(result(12) as never);
    const indexed = await route.generateMetadata(props("react"));

    expect(indexed.robots).toBeUndefined();
    expect(indexed.alternates?.canonical).toBe(
      "http://localhost:3000/viec-lam/ky-nang/react"
    );
    expect(indexed.title).toBe(H1);

    jest
      .mocked(fetchPublicJobSearchStrict)
      .mockResolvedValue(result(4) as never);
    expect((await route.generateMetadata(props("react"))).robots).toEqual({
      index: false,
      follow: true,
    });
  });

  it("puts the page number in the title and canonical", async () => {
    jest
      .mocked(fetchPublicJobSearchStrict)
      .mockResolvedValue(result(45) as never);
    const metadata = await route.generateMetadata(
      props("react", { page: "2" })
    );

    expect(metadata.alternates?.canonical).toBe(
      "http://localhost:3000/viec-lam/ky-nang/react?page=2"
    );
    expect(metadata.title).toBe(
      `meta.pagedTitle:${JSON.stringify({ title: H1, page: 2 })}`
    );
  });

  it("answers 404 for unknown slugs and pages past the last one", async () => {
    await expect(route.Page(props("cobol"))).rejects.toThrow("NEXT_NOT_FOUND");

    jest
      .mocked(fetchPublicJobSearchStrict)
      .mockResolvedValue(result(12) as never);
    await expect(route.Page(props("react", { page: "3" }))).rejects.toThrow(
      "NEXT_NOT_FOUND"
    );
  });

  it("lets a backend failure propagate (500)", async () => {
    jest
      .mocked(fetchPublicJobSearchStrict)
      .mockRejectedValue(new Error("Backend answered 503"));

    await expect(route.Page(props("react"))).rejects.toThrow("503");
  });

  it("renders the H1, cards, at most 6 distinct companies and pagination", async () => {
    const companies = ["A", "B", "A", "C", "D", "E", "F", "G"];
    jest
      .mocked(fetchPublicJobSearchStrict)
      .mockResolvedValue(result(45, companies) as never);

    render(await route.Page(props("react")));

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(H1);
    expect(screen.getAllByTestId("card")).toHaveLength(8);
    expect(
      screen.getByText('landingPage.someCompanies:{"names":"A, B, C, D, E, F"}')
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "landingPage.pagination" })
    ).toBeInTheDocument();
  });
});
