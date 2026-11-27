import { fireEvent, render, screen, within } from "@testing-library/react";
import Home from "./home-page-client";
import { useGetTopHiringCompaniesQuery } from "@/features/company/redux/company.api";
import type { TopHiringCompany } from "@/features/company/schemas/company.schema";
import { useGetJobsQuery } from "@/features/job/redux/job.api";
import type { Job } from "@/features/job/schemas/job.schema";
import type { IPublicStats } from "@/shared/types/dashboard";
import type { PaginatedResult } from "@/shared/types/pagination";

const mockPush = jest.fn();
let mockIsStaff = false;
let mockHasSession = false;
let mockLanguage: "en" | "vi" = "vi";

jest.mock("@/lib/auth/session", () => ({
  hasSession: () => mockHasSession,
}));

jest.mock("@/lib/redux/hooks", () => ({
  useAppSelector: (selector: () => unknown) => selector(),
}));

// The real slice imports next-intl navigation (ESM), which Jest cannot load here.
jest.mock("@/features/auth/redux/auth.slice", () => ({
  selectIsAdmin: () => mockIsStaff,
}));

jest.mock("@/i18n/navigation", () => ({
  Link: ({
    children,
    className,
    href,
  }: {
    children: React.ReactNode;
    className?: string;
    href: string | { pathname: string; query?: Record<string, string> };
  }) => (
    <a
      className={className}
      href={
        typeof href === "string"
          ? href
          : `${href.pathname}${href.query ? `?${new URLSearchParams(href.query)}` : ""}`
      }
    >
      {children}
    </a>
  ),
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({
    mounted: true,
    language: mockLanguage,
    t: (key: string) => key,
  }),
}));

jest.mock("@/features/auth/redux/auth.api", () => ({
  useGetMeQuery: jest.fn(),
}));

jest.mock("@/features/job/redux/job.api", () => ({
  useGetJobsQuery: jest.fn(() => ({
    data: {
      data: {
        meta: {
          pagination: {
            total_pages: 1,
          },
        },
        result: [{ _id: "fetched-job", name: "Fetched job" }],
      },
    },
    error: undefined,
    isLoading: false,
  })),
}));

jest.mock("@/features/company/redux/company.api", () => ({
  useGetTopHiringCompaniesQuery: jest.fn(() => ({
    data: {
      data: [{ _id: "fetched-company", name: "Fetched company" }],
    },
    error: undefined,
    isLoading: false,
  })),
}));

jest.mock("@/components/ui/search-suggest-input", () => ({
  SearchSuggestInput: ({
    id,
    onChange,
    onSubmit,
    placeholder,
    value,
  }: {
    id?: string;
    onChange: (value: string) => void;
    onSubmit?: (value: string) => void;
    placeholder?: string;
    value: string;
  }) => (
    <div>
      <input
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <button type="button" onClick={() => onSubmit?.("NextJS")}>
        Choose NextJS
      </button>
    </div>
  ),
}));

jest.mock("@/components/single-select", () => ({
  SingleSelect: ({ placeholder }: { placeholder?: string }) => (
    <div>{placeholder}</div>
  ),
}));

jest.mock("@/features/job/components/job-card", () => ({
  JobCard: ({ job, variant }: { job: { name: string }; variant?: string }) => (
    <div data-testid={`job-card-${variant ?? "default"}`}>{job.name}</div>
  ),
}));

jest.mock("@/features/company/components/company-card", () => ({
  CompanyCard: ({ company }: { company: { name: string } }) => (
    <div data-testid="company-card">{company.name}</div>
  ),
}));

jest.mock("@/components/ui/carousel", () => ({
  Carousel: ({
    children,
    setApi,
  }: {
    children: React.ReactNode;
    setApi?: any;
  }) => {
    // Call setApi in mock if provided to avoid runtime null checks or warnings
    return <div>{children}</div>;
  },
  CarouselContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CarouselItem: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CarouselPrevious: () => <button type="button">Previous slide</button>,
  CarouselNext: () => <button type="button">Next slide</button>,
}));

jest.mock("@/components/sections/section-header", () => ({
  SectionHeader: () => <div data-testid="section-header" />,
}));

jest.mock("@/components/sections/section-container", () => ({
  SectionContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

const initialJobs = {
  meta: { pagination: { total_pages: 3 } },
  result: [{ _id: "server-job", name: "Server job" }],
} as PaginatedResult<Job>;

const initialCompanies = [
  { _id: "server-company", name: "Server company" },
] as TopHiringCompany[];

const stats: IPublicStats = {
  activeJobs: 1234,
  newJobsThisWeek: 35,
  hiringCompanies: 42,
  candidates: 0,
};

const latestQuery = {
  page: 1,
  limit: 6,
  filter: "isActive=true",
  sort: "sort=-createdAt",
};
const topSalaryQuery = { ...latestQuery, sort: "sort=-salary" };

const listedJobs = (variant: "default" | "compact") =>
  screen
    .queryAllByTestId(`job-card-${variant}`)
    .map((node) => node.textContent);

describe("Home", () => {
  afterEach(() => {
    jest.clearAllMocks();
    mockIsStaff = false;
    mockHasSession = false;
    mockLanguage = "vi";
  });

  it("navigates with the selected suggestion instead of the stale typed keyword", () => {
    render(<Home initialJobs={null} initialCompanies={null} />);

    fireEvent.change(screen.getByLabelText("home.jobTitleOrKeyword"), {
      target: { value: "ne" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Choose NextJS" }));

    expect(mockPush).toHaveBeenCalledWith({
      pathname: "/jobs",
      query: { q: "NextJS" },
    });
  });

  it("renders the server data and skips both queries", () => {
    render(
      <Home initialJobs={initialJobs} initialCompanies={initialCompanies} />
    );

    expect(listedJobs("default")).toEqual(["Server job"]);
    expect(screen.getByText("Server company")).toBeInTheDocument();
    expect(screen.queryByText("Fetched company")).not.toBeInTheDocument();
    expect(useGetJobsQuery).toHaveBeenCalledWith(latestQuery, { skip: true });
    expect(useGetJobsQuery).toHaveBeenLastCalledWith(topSalaryQuery, {
      skip: true,
    });
    expect(useGetTopHiringCompaniesQuery).toHaveBeenLastCalledWith(
      { limit: 8 },
      { skip: true }
    );
  });

  it("fetches on the client when the server sent nothing", () => {
    render(<Home initialJobs={null} initialCompanies={null} />);

    expect(listedJobs("default")).toEqual(["Fetched job"]);
    expect(screen.getByText("Fetched company")).toBeInTheDocument();
    expect(useGetJobsQuery).toHaveBeenCalledWith(latestQuery, { skip: false });
    expect(useGetTopHiringCompaniesQuery).toHaveBeenLastCalledWith(
      { limit: 8 },
      { skip: false }
    );
  });

  it("ignores the server job list for signed-in HR and Super Admin", () => {
    mockIsStaff = true;
    mockHasSession = true;

    render(
      <Home initialJobs={initialJobs} initialCompanies={initialCompanies} />
    );

    // The first render keeps the server list so hydration matches the server HTML.
    expect(useGetJobsQuery).toHaveBeenNthCalledWith(1, latestQuery, {
      skip: true,
    });
    expect(useGetJobsQuery).toHaveBeenCalledWith(latestQuery, { skip: false });
    expect(listedJobs("default")).toEqual(["Fetched job"]);
    // Top hiring companies do not depend on the role.
    expect(screen.getByText("Server company")).toBeInTheDocument();
  });

  it("lists the three steps as an ordered list", () => {
    render(<Home initialJobs={null} initialCompanies={null} />);

    const steps = screen.getByRole("list", { name: "home.howItWorks" });
    expect(steps.tagName).toBe("OL");
    expect(within(steps).getAllByRole("listitem")).toHaveLength(3);
    expect(within(steps).getByText("home.getHired")).toBeInTheDocument();
  });

  it("fetches the top-salary list only once its tab is opened", () => {
    render(
      <Home initialJobs={initialJobs} initialCompanies={initialCompanies} />
    );

    expect(useGetJobsQuery).not.toHaveBeenCalledWith(topSalaryQuery, {
      skip: false,
    });

    fireEvent.mouseDown(
      screen.getByRole("tab", { name: "home.tabTopSalary" }),
      { button: 0 }
    );

    expect(useGetJobsQuery).toHaveBeenLastCalledWith(topSalaryQuery, {
      skip: false,
    });
    expect(listedJobs("default")).toEqual(["Fetched job"]);
  });

  it("points 'view all' at the job list sorted like the open tab", () => {
    render(
      <Home initialJobs={initialJobs} initialCompanies={initialCompanies} />
    );
    const viewAll = () =>
      screen.getByRole("link", { name: /home\.viewAllJobs/ });

    expect(viewAll()).toHaveAttribute("href", "/jobs");

    fireEvent.mouseDown(
      screen.getByRole("tab", { name: "home.tabTopSalary" }),
      { button: 0 }
    );

    expect(viewAll()).toHaveAttribute("href", "/jobs?sort=-salary");
  });

  it("shows the three newest server jobs as compact cards in the hero", () => {
    const fourJobs = {
      meta: { pagination: { total_pages: 1 } },
      result: ["A", "B", "C", "D"].map((name) => ({ _id: name, name })),
    } as PaginatedResult<Job>;

    render(<Home initialJobs={fourJobs} initialCompanies={initialCompanies} />);

    expect(listedJobs("compact")).toEqual(["A", "B", "C"]);
  });

  it("keeps the single-column hero when the server sent no jobs", () => {
    render(<Home initialJobs={null} initialCompanies={null} />);

    expect(listedJobs("compact")).toEqual([]);
  });

  it("loads the hero banner as a prioritized image, not a CSS background", () => {
    const { container } = render(
      <Home initialJobs={null} initialCompanies={null} />
    );
    const hero = container.querySelector(
      'img[src*="homepage-it-careers-banner.png"]'
    );

    expect(hero).not.toBeNull();
    expect(hero).toHaveAttribute("alt", "");
    expect(hero).toHaveAttribute("fetchpriority", "high");
    expect(hero).not.toHaveAttribute("loading", "lazy");
    expect(
      container.querySelector('[class*="homepage-it-careers-banner"]')
    ).toBeNull();
  });

  it("shows the admin's first slide and falls back when it cannot load", () => {
    const { container } = render(
      <Home
        initialJobs={null}
        initialCompanies={null}
        slides={[
          {
            id: "s1",
            imageUrl: "http://localhost:8081/images/banner/custom.png",
            mobileImageUrl: null,
            content: null,
          },
        ]}
      />
    );
    const hero = () => container.querySelector('img[fetchpriority="high"]')!;

    expect(hero().getAttribute("src")).toContain("custom.png");
    fireEvent.error(hero());
    expect(hero().getAttribute("src")).toContain(
      "homepage-it-careers-banner.png"
    );
  });

  it("shows the real stats with locale separators and hides a zero stat", () => {
    render(<Home initialJobs={null} initialCompanies={null} stats={stats} />);

    expect(screen.getByText("1.234")).toBeInTheDocument();
    expect(screen.getByText("home.activeJobs")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("home.hiringCompanies")).toBeInTheDocument();
    expect(screen.getByText("35")).toBeInTheDocument();
    expect(screen.getByText("home.newJobsThisWeek")).toBeInTheDocument();
    expect(screen.queryByText("home.jobSeekers")).not.toBeInTheDocument();
    expect(screen.queryByText("20k+")).not.toBeInTheDocument();
  });

  it("formats the stats for English", () => {
    mockLanguage = "en";
    render(<Home initialJobs={null} initialCompanies={null} stats={stats} />);

    expect(screen.getByText("1,234")).toBeInTheDocument();
  });

  it.each([
    ["no stats", null],
    [
      "all-zero stats",
      {
        activeJobs: 0,
        newJobsThisWeek: 0,
        hiringCompanies: 0,
        candidates: 0,
      },
    ],
  ])("renders no stats row for %s", (_case, value) => {
    render(<Home initialJobs={null} initialCompanies={null} stats={value} />);

    expect(screen.queryByText("home.activeJobs")).not.toBeInTheDocument();
    expect(screen.queryByText("home.jobSeekers")).not.toBeInTheDocument();
    expect(screen.queryByText("20k+")).not.toBeInTheDocument();
  });
});
