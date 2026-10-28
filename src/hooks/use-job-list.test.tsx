import { act, renderHook } from "@testing-library/react";
import { useSearchJobsQuery } from "@/features/job/redux/job.api";
import { useJobList } from "@/hooks/use-job-list";
import type { JobSearchItem } from "@/features/job/schemas/job-search.schema";
import {
  DEFAULT_JOB_LIST_SORT,
  type JobListSearchState,
} from "@/lib/utils/public-listing";
import type { PaginatedResult } from "@/shared/types/pagination";

jest.mock("@/features/job/redux/job.api", () => ({
  useSearchJobsQuery: jest.fn(),
}));

const mockUseSearchJobsQuery = useSearchJobsQuery as jest.Mock;

const createInitialData = (): PaginatedResult<JobSearchItem> => ({
  result: [],
  meta: {
    pagination: {
      current_page: 1,
      per_page: 10,
      total: 0,
      total_pages: 0,
    },
  },
});

const createInitialSearchState = (
  overrides: Partial<JobListSearchState> = {}
): JobListSearchState => ({
  experience: "all",
  limit: 10,
  locationCode: "",
  page: 2,
  q: "",
  salary: "all",
  sort: "-createdAt",
  source: "all",
  type: "all",
  ...overrides,
});

describe("useJobList", () => {
  beforeEach(() => {
    mockUseSearchJobsQuery.mockReturnValue({
      data: {
        data: createInitialData(),
      },
      isFetching: false,
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("keeps typed search in draft state until filters are applied", () => {
    const { result } = renderHook(() =>
      useJobList({
        initialData: createInitialData(),
        initialSearchState: createInitialSearchState(),
      })
    );

    act(() => {
      result.current.setSearchInput("react");
    });

    expect(result.current.searchInput).toBe("react");
    expect(result.current.searchQuery).toBe("");
    expect(result.current.currentPage).toBe(2);
    expect(result.current.isDraftDirty).toBe(true);
    expect(mockUseSearchJobsQuery).toHaveBeenLastCalledWith(
      {
        limit: 10,
        page: 2,
        sort: "newest",
      },
      { skip: true }
    );
  });

  it("commits draft filters and resets to page 1 when applyFilters is called", () => {
    const { result } = renderHook(() =>
      useJobList({
        initialData: createInitialData(),
        initialSearchState: createInitialSearchState(),
      })
    );

    act(() => {
      result.current.setSearchInput("react");
      result.current.setLocationInput("ha-noi");
      result.current.setDraftJobType("Full-time");
    });

    act(() => {
      result.current.applyFilters();
    });

    expect(result.current.searchQuery).toBe("react");
    expect(result.current.locationQuery).toBe("ha-noi");
    expect(result.current.jobType).toBe("Full-time");
    expect(result.current.currentPage).toBe(1);
    expect(result.current.isDraftDirty).toBe(false);
    expect(mockUseSearchJobsQuery).toHaveBeenLastCalledWith(
      {
        formOfWork: "Full-time",
        keyword: "react",
        limit: 10,
        locationCode: "ha-noi",
        page: 1,
        sort: "newest",
      },
      { skip: false }
    );
  });

  it("clears draft, applied filters, and sort together on resetAllFilters", () => {
    const { result } = renderHook(() =>
      useJobList({
        initialData: createInitialData(),
        initialSearchState: createInitialSearchState(),
      })
    );

    act(() => {
      result.current.setSearchInput("golang");
      result.current.setLocationInput("da-nang");
      result.current.setDraftJobType("Remote");
      result.current.setDraftExperience("Senior");
      result.current.setDraftSalaryRange("10000000-20000000");
    });

    act(() => {
      result.current.applyFilters();
      result.current.setSortBy("salary");
      result.current.setSearchInput("typescript");
    });

    expect(result.current.searchInput).toBe("typescript");
    expect(result.current.searchQuery).toBe("golang");
    expect(result.current.locationQuery).toBe("da-nang");
    expect(result.current.sortBy).toBe("salary");
    expect(result.current.isDraftDirty).toBe(true);

    act(() => {
      result.current.resetAllFilters();
    });

    expect(result.current.searchInput).toBe("");
    expect(result.current.searchQuery).toBe("");
    expect(result.current.locationInput).toBe("");
    expect(result.current.locationQuery).toBe("");
    expect(result.current.jobType).toBe("all");
    expect(result.current.experience).toBe("all");
    expect(result.current.salaryRange).toBe("all");
    expect(result.current.sortBy).toBe(DEFAULT_JOB_LIST_SORT);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.isDraftDirty).toBe(false);
  });

  it("keeps sort changes applied until resetAllFilters is called", () => {
    const { result } = renderHook(() =>
      useJobList({
        initialData: createInitialData(),
        initialSearchState: createInitialSearchState(),
      })
    );

    act(() => {
      result.current.setSortBy("salary");
    });

    expect(result.current.sortBy).toBe("salary");
    expect(result.current.currentPage).toBe(1);

    act(() => {
      result.current.setSearchInput("react");
      result.current.setDraftJobType("Full-time");
    });

    expect(result.current.sortBy).toBe("salary");
    expect(result.current.searchQuery).toBe("");
    expect(result.current.isDraftDirty).toBe(true);

    act(() => {
      result.current.resetAllFilters();
    });

    expect(result.current.searchInput).toBe("");
    expect(result.current.draftJobType).toBe("all");
    expect(result.current.sortBy).toBe(DEFAULT_JOB_LIST_SORT);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.isDraftDirty).toBe(false);
  });

  it("updates applied and draft search state when initialSearchState changes", () => {
    let initialSearchState = createInitialSearchState({ q: "initial" });
    const { result, rerender } = renderHook(
      (props) => useJobList(props),
      {
        initialProps: {
          initialData: createInitialData(),
          initialSearchState,
        },
      }
    );

    expect(result.current.searchQuery).toBe("initial");
    expect(result.current.searchInput).toBe("initial");

    // Simulate URL changes (e.g., Back/Forward button) resulting in a new initialSearchState
    initialSearchState = createInitialSearchState({ q: "new-query" });
    rerender({
      initialData: createInitialData(),
      initialSearchState,
    });

    expect(result.current.searchQuery).toBe("new-query");
    expect(result.current.searchInput).toBe("new-query");
  });

  it("switches source immediately and resets to page 1", () => {
    const { result } = renderHook(() =>
      useJobList({
        initialData: createInitialData(),
        initialSearchState: createInitialSearchState(),
      })
    );

    act(() => {
      result.current.setSource("external");
    });

    expect(result.current.source).toBe("external");
    expect(result.current.currentPage).toBe(1);
    expect(mockUseSearchJobsQuery).toHaveBeenLastCalledWith(
      expect.objectContaining({ source: "external", page: 1 }),
      expect.objectContaining({ skip: false })
    );
  });

  it("resets source to all on resetAllFilters", () => {
    const { result } = renderHook(() =>
      useJobList({
        initialData: createInitialData(),
        initialSearchState: createInitialSearchState({ source: "internal" }),
      })
    );

    act(() => {
      result.current.resetAllFilters();
    });

    expect(result.current.source).toBe("all");
  });
});
