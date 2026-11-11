import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import type { JobListState } from "@/features/job/hooks/use-job-list";
import { useSearchJobsQuery } from "@/features/job/redux/job.api";
import type { JobFilterSummary } from "@/features/job/utils/job-filter-summary";
import { MobileFilterDrawer } from "./mobile-filter-drawer";

jest.mock("@/features/job/redux/job.api", () => ({
  useSearchJobsQuery: jest.fn(() => ({ data: undefined })),
}));

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({
    t: (key: string, values?: Record<string, unknown>) =>
      values && "count" in values ? `${key}:${values.count}` : key,
  }),
}));

// vaul's Drawer needs real pointer/animation APIs; a context stub keeps open/close behaviour.
jest.mock("@/components/ui/drawer", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  const DrawerContext = React.createContext({
    open: false,
    setOpen: (_open: boolean) => {},
  });
  const Passthrough = ({ children }: { children?: ReactNode }) => (
    <div>{children}</div>
  );

  return {
    Drawer: ({
      open,
      onOpenChange,
      children,
    }: {
      open: boolean;
      onOpenChange: (open: boolean) => void;
      children?: ReactNode;
    }) => (
      <DrawerContext.Provider value={{ open, setOpen: onOpenChange }}>
        {children}
      </DrawerContext.Provider>
    ),
    DrawerTrigger: ({ children }: { children?: ReactNode }) => {
      const { setOpen } = React.useContext(DrawerContext);
      return <div onClick={() => setOpen(true)}>{children}</div>;
    },
    DrawerContent: ({ children }: { children?: ReactNode }) => {
      const { open } = React.useContext(DrawerContext);
      return open ? <div role="dialog">{children}</div> : null;
    },
    DrawerHeader: Passthrough,
    DrawerTitle: Passthrough,
    DrawerDescription: Passthrough,
    DrawerFooter: Passthrough,
  };
});

const mockUseSearchJobsQuery = useSearchJobsQuery as jest.Mock;

const summary: JobFilterSummary = {
  activeFiltersCount: 0,
  hasAppliedFilters: false,
  hasResettableState: false,
  showExternalFilterHint: false,
};

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

function openDrawer() {
  fireEvent.click(screen.getByRole("button", { name: "jobsPage.filters" }));
}

describe("MobileFilterDrawer", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("skips the draft count query while closed and runs it once opened", () => {
    render(
      <MobileFilterDrawer list={createJobListState()} summary={summary} />
    );

    expect(mockUseSearchJobsQuery).toHaveBeenLastCalledWith(
      expect.any(Object),
      { skip: true }
    );

    openDrawer();

    expect(mockUseSearchJobsQuery).toHaveBeenLastCalledWith(
      expect.any(Object),
      { skip: false }
    );
  });

  it("applies the draft filters and closes the drawer", () => {
    const list = createJobListState();
    render(<MobileFilterDrawer list={list} summary={summary} />);
    openDrawer();

    fireEvent.click(
      screen.getByRole("button", { name: /jobsPage\.applyFilters/ })
    );

    expect(list.applyFilters).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("resets the three draft filters to 'all'", () => {
    const list = createJobListState({
      draftJobType: "Remote",
      draftExperience: "Senior",
      draftSalaryRange: "0-10000000",
    });
    render(<MobileFilterDrawer list={list} summary={summary} />);
    openDrawer();

    fireEvent.click(
      screen.getByRole("button", { name: "jobsPage.clearAllFilters" })
    );

    expect(list.setDraftJobType).toHaveBeenCalledWith("all");
    expect(list.setDraftExperience).toHaveBeenCalledWith("all");
    expect(list.setDraftSalaryRange).toHaveBeenCalledWith("all");
  });
});
