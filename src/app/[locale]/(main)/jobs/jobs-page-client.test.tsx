import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import type { JobListState } from "@/features/job/hooks/use-job-list";
import type { JobSearchItem } from "@/features/job/schemas/job-search.schema";
import JobsPageClient from "./jobs-page-client";

const mockUseJobList = jest.fn();

jest.mock("@/features/job/hooks/use-job-list", () => ({
  useJobList: (...args: unknown[]) => mockUseJobList(...args),
}));

jest.mock("@/features/job/hooks/use-job-list-url-sync", () => ({
  useJobListUrlSync: () => ({ current: null }),
}));

jest.mock("@/features/job/redux/job.api", () => ({
  useSearchJobsQuery: jest.fn(() => ({ data: undefined })),
}));

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({
    t: (key: string, values?: Record<string, unknown>) =>
      values && "count" in values ? `${key}:${values.count}` : key,
  }),
}));

jest.mock("@/i18n/navigation", () => ({
  Link: ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock("@/components/search/job-search-box", () => ({
  JobSearchBox: () => <div data-testid="job-search-box" />,
}));

jest.mock("@/components/simple-pagination", () => ({
  SimplePagination: () => <nav data-testid="pagination" />,
}));

jest.mock("@/features/job/components/job-search-card", () => ({
  JobSearchCard: ({ item }: { item: JobSearchItem }) => (
    <div data-testid="job-search-card">{item.id}</div>
  ),
}));

// Radix Select cannot open in jsdom; a native <select> exposes the same value/onValueChange contract.
jest.mock("@/components/ui/select", () => ({
  Select: ({
    value,
    onValueChange,
    children,
  }: {
    value: string;
    onValueChange: (value: string) => void;
    children?: ReactNode;
  }) => (
    <select value={value} onChange={(e) => onValueChange(e.target.value)}>
      {children}
    </select>
  ),
  SelectTrigger: () => null,
  SelectValue: () => null,
  SelectContent: ({ children }: { children?: ReactNode }) => <>{children}</>,
  SelectItem: ({
    value,
    children,
  }: {
    value: string;
    children?: ReactNode;
  }) => <option value={value}>{children}</option>,
}));

jest.mock("@/components/ui/drawer", () => {
  const Passthrough = ({ children }: { children?: ReactNode }) => (
    <div>{children}</div>
  );
  return {
    Drawer: Passthrough,
    DrawerTrigger: Passthrough,
    DrawerContent: () => null,
    DrawerHeader: Passthrough,
    DrawerTitle: Passthrough,
    DrawerDescription: Passthrough,
    DrawerFooter: Passthrough,
  };
});

function createJobListState(
  overrides: Partial<JobListState> = {}
): JobListState {
  return {
    jobs: [],
    totalItems: 0,
    totalPages: 0,
    currentSearchState: {
      experience: "all",
      limit: 10,
      locationCode: "",
      page: 1,
      q: "",
      salary: "all",
      sort: "-createdAt",
      source: "all",
      type: "all",
    },
    currentPage: 1,
    pageSize: 10,
    isLoading: false,
    searchInput: "",
    setSearchInput: jest.fn(),
    locationInput: "",
    setLocationInput: jest.fn(),
    searchQuery: "",
    locationQuery: "",
    draftJobType: "all",
    setDraftJobType: jest.fn(),
    draftExperience: "all",
    setDraftExperience: jest.fn(),
    draftSalaryRange: "all",
    setDraftSalaryRange: jest.fn(),
    jobType: "all",
    experience: "all",
    salaryRange: "all",
    sortBy: "-createdAt",
    setSortBy: jest.fn(),
    source: "all",
    setSource: jest.fn(),
    setPage: jest.fn(),
    setLimit: jest.fn(),
    applyFilters: jest.fn(),
    resetAllFilters: jest.fn(),
    resetFilterBar: jest.fn(),
    isDraftDirty: false,
    ...overrides,
  };
}

const twoJobs = [{ id: "job-a" }, { id: "job-b" }] as JobSearchItem[];

function renderPage(list: JobListState) {
  mockUseJobList.mockReturnValue(list);
  return render(
    <JobsPageClient
      initialData={null}
      initialSearchState={list.currentSearchState}
    />
  );
}

describe("JobsPageClient", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the hero, filters and job list", () => {
    renderPage(
      createJobListState({ jobs: twoJobs, totalItems: 2, totalPages: 1 })
    );

    expect(screen.getByTestId("job-search-box")).toBeInTheDocument();
    expect(screen.getByText("jobsPage.breadcrumb")).toBeInTheDocument();
    expect(screen.getAllByTestId("job-search-card")).toHaveLength(2);
    expect(screen.getByTestId("pagination")).toBeInTheDocument();
  });

  it("changes the sort through setSortBy", () => {
    const list = createJobListState({ jobs: twoJobs, totalItems: 2 });
    renderPage(list);

    fireEvent.change(screen.getByDisplayValue("jobsPage.sortOptions.newest"), {
      target: { value: "salary" },
    });

    expect(list.setSortBy).toHaveBeenCalledWith("salary");
  });

  it("shows the empty state with a clear button when filters are applied", () => {
    const list = createJobListState({
      currentSearchState: {
        ...createJobListState().currentSearchState,
        type: "Remote",
      },
    });
    renderPage(list);

    expect(screen.getByText("jobsPage.emptyTitle")).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "jobsPage.clearAllFilters" })
    );
    expect(list.resetAllFilters).toHaveBeenCalled();
  });

  it.each([
    [1, "1 jobsPage.resultsFoundSuffix:1"],
    [2, "2 jobsPage.resultsFoundSuffix:2"],
  ])("renders the translated result count for %i job(s)", (count, text) => {
    renderPage(
      createJobListState({ jobs: twoJobs.slice(0, count), totalItems: count })
    );

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent(text);
    expect(heading).not.toHaveTextContent(/IT Jobs|Job found/);
  });
});
