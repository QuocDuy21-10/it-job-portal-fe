import { fireEvent, render, screen } from "@testing-library/react";
import Home from "./home-page-client";
import { useGetTopHiringCompaniesQuery } from "@/features/company/redux/company.api";
import type { TopHiringCompany } from "@/features/company/schemas/company.schema";
import { useGetJobsQuery } from "@/features/job/redux/job.api";
import type { Job } from "@/features/job/schemas/job.schema";
import type { PaginatedResult } from "@/shared/types/pagination";

const mockPush = jest.fn();
let mockIsStaff = false;
let mockHasSession = false;

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
    href: string;
  }) => (
    <a className={className} href={href}>
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
  JobCard: ({ job }: { job: { name: string } }) => (
    <div data-testid="job-card">{job.name}</div>
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

jest.mock("@/components/simple-pagination", () => ({
  SimplePagination: ({
    onPageChange,
  }: {
    onPageChange: (page: number) => void;
  }) => (
    <button type="button" onClick={() => onPageChange(2)}>
      Go to page 2
    </button>
  ),
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

const page1Query = {
  page: 1,
  limit: 6,
  filter: "isActive=true",
  sort: "sort=-createdAt",
};

describe("Home", () => {
  afterEach(() => {
    jest.clearAllMocks();
    mockIsStaff = false;
    mockHasSession = false;
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

    expect(screen.getByText("Server job")).toBeInTheDocument();
    expect(screen.getByText("Server company")).toBeInTheDocument();
    expect(screen.queryByText("Fetched job")).not.toBeInTheDocument();
    expect(screen.queryByText("Fetched company")).not.toBeInTheDocument();
    expect(useGetJobsQuery).toHaveBeenLastCalledWith(page1Query, {
      skip: true,
    });
    expect(useGetTopHiringCompaniesQuery).toHaveBeenLastCalledWith(
      { limit: 8 },
      { skip: true }
    );
  });

  it("fetches on the client when the server sent nothing", () => {
    render(<Home initialJobs={null} initialCompanies={null} />);

    expect(screen.getByText("Fetched job")).toBeInTheDocument();
    expect(screen.getByText("Fetched company")).toBeInTheDocument();
    expect(useGetJobsQuery).toHaveBeenLastCalledWith(page1Query, {
      skip: false,
    });
    expect(useGetTopHiringCompaniesQuery).toHaveBeenLastCalledWith(
      { limit: 8 },
      { skip: false }
    );
  });

  it("fetches page 2 on the client", () => {
    render(
      <Home initialJobs={initialJobs} initialCompanies={initialCompanies} />
    );

    fireEvent.click(screen.getByRole("button", { name: "Go to page 2" }));

    expect(useGetJobsQuery).toHaveBeenLastCalledWith(
      { ...page1Query, page: 2 },
      { skip: false }
    );
    expect(screen.getByText("Fetched job")).toBeInTheDocument();
    expect(screen.queryByText("Server job")).not.toBeInTheDocument();
  });

  it("ignores the server job list for signed-in HR and Super Admin", () => {
    mockIsStaff = true;
    mockHasSession = true;

    render(
      <Home initialJobs={initialJobs} initialCompanies={initialCompanies} />
    );

    // The first render keeps the server list so hydration matches the server HTML.
    expect(useGetJobsQuery).toHaveBeenNthCalledWith(1, page1Query, {
      skip: true,
    });
    expect(useGetJobsQuery).toHaveBeenLastCalledWith(page1Query, {
      skip: false,
    });
    expect(screen.getByText("Fetched job")).toBeInTheDocument();
    expect(screen.queryByText("Server job")).not.toBeInTheDocument();
    // Top hiring companies do not depend on the role.
    expect(screen.getByText("Server company")).toBeInTheDocument();
  });
});
