import { act, renderHook } from "@testing-library/react";
import { useGetJobsQuery } from "@/features/job/redux/job.api";
import { useJobList } from "@/hooks/use-job-list";
import type { Job } from "@/features/job/schemas/job.schema";
import type { JobListSearchState } from "@/lib/utils/public-listing";
import type { PaginatedResult } from "@/shared/types/pagination";

jest.mock("@/features/job/redux/job.api", () => ({
  useGetJobsQuery: jest.fn(),
}));

const mockUseGetJobsQuery = useGetJobsQuery as jest.Mock;

const createInitialData = (): PaginatedResult<Job> => ({
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
  location: "",
  page: 2,
  q: "",
  salary: "all",
  sort: "-createdAt",
  type: "all",
  ...overrides,
});

describe("useJobList", () => {
  beforeEach(() => {
    mockUseGetJobsQuery.mockReturnValue({
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
    expect(mockUseGetJobsQuery).toHaveBeenLastCalledWith(
      {
        filter: "isActive=true",
        keyword: undefined,
        limit: 10,
        page: 2,
        sort: "sort=-createdAt",
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
      result.current.setLocationInput("Ha Noi");
      result.current.setDraftJobType("Full-time");
    });

    act(() => {
      result.current.applyFilters();
    });

    expect(result.current.searchQuery).toBe("react");
    expect(result.current.locationQuery).toBe("Ha Noi");
    expect(result.current.jobType).toBe("Full-time");
    expect(result.current.currentPage).toBe(1);
    expect(result.current.isDraftDirty).toBe(false);
    expect(mockUseGetJobsQuery).toHaveBeenLastCalledWith(
      {
        filter: "isActive=true&location=/Ha%20Noi/i&formOfWork=Full-time",
        keyword: "react",
        limit: 10,
        page: 1,
        sort: "sort=-createdAt",
      },
      { skip: false }
    );
  });

  it("clears draft and applied filters together on resetAllFilters", () => {
    const { result } = renderHook(() =>
      useJobList({
        initialData: createInitialData(),
        initialSearchState: createInitialSearchState({
          experience: "Senior",
          location: "Da Nang",
          q: "golang",
          salary: "10000000-20000000",
          sort: "salary",
          type: "Remote",
        }),
      })
    );

    act(() => {
      result.current.resetAllFilters();
    });

    expect(result.current.searchInput).toBe("");
    expect(result.current.searchQuery).toBe("");
    expect(result.current.locationInput).toBe("");
    expect(result.current.jobType).toBe("all");
    expect(result.current.experience).toBe("all");
    expect(result.current.salaryRange).toBe("all");
    expect(result.current.sortBy).toBe("-createdAt");
    expect(result.current.currentPage).toBe(1);
  });
});