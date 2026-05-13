import { useCallback, useMemo, useState } from "react";
import { useGetJobsQuery } from "@/features/job/redux/job.api";
import type { Job } from "@/features/job/schemas/job.schema";
import {
  DEFAULT_JOB_LIST_SORT,
  areJobListSearchStatesEqual,
  buildJobListQueryArgs,
  type JobListSearchState,
} from "@/lib/utils/public-listing";
import type { PaginatedResult } from "@/shared/types/pagination";

type UseJobListProps = {
  initialData?: PaginatedResult<Job> | null;
  initialSearchState: JobListSearchState;
};

type JobListDraftState = Pick<
  JobListSearchState,
  "experience" | "locationCode" | "q" | "salary" | "type"
>;

const EMPTY_DRAFT_STATE: JobListDraftState = {
  experience: "all",
  locationCode: "",
  q: "",
  salary: "all",
  type: "all",
};

const createDraftState = (
  searchState: JobListSearchState
): JobListDraftState => ({
  experience: searchState.experience,
  locationCode: searchState.locationCode,
  q: searchState.q,
  salary: searchState.salary,
  type: searchState.type,
});

const areDraftStatesEqual = (
  left: JobListDraftState,
  right: JobListDraftState
) => {
  return (
    left.experience === right.experience &&
    left.locationCode === right.locationCode &&
    left.q === right.q &&
    left.salary === right.salary &&
    left.type === right.type
  );
};

export function useJobList({
  initialData,
  initialSearchState,
}: UseJobListProps) {
  const [draftState, setDraftState] = useState<JobListDraftState>(() => {
    return createDraftState(initialSearchState);
  });
  const [currentSearchState, setCurrentSearchState] =
    useState<JobListSearchState>(initialSearchState);
  const appliedDraftState = useMemo(() => {
    return createDraftState(currentSearchState);
  }, [currentSearchState]);

  const isDraftDirty = !areDraftStatesEqual(draftState, appliedDraftState);

  const setSearchInput = useCallback((value: string) => {
    setDraftState((currentDraftState) => {
      if (currentDraftState.q === value) {
        return currentDraftState;
      }

      return {
        ...currentDraftState,
        q: value,
      };
    });
  }, []);

  const setLocationInput = useCallback((value: string) => {
    setDraftState((currentDraftState) => {
      if (currentDraftState.locationCode === value) {
        return currentDraftState;
      }

      return {
        ...currentDraftState,
        locationCode: value,
      };
    });
  }, []);

  const setDraftJobType = useCallback((value: string) => {
    setDraftState((currentDraftState) => {
      if (currentDraftState.type === value) {
        return currentDraftState;
      }

      return {
        ...currentDraftState,
        type: value,
      };
    });
  }, []);

  const setDraftExperience = useCallback((value: string) => {
    setDraftState((currentDraftState) => {
      if (currentDraftState.experience === value) {
        return currentDraftState;
      }

      return {
        ...currentDraftState,
        experience: value,
      };
    });
  }, []);

  const setDraftSalaryRange = useCallback((value: string) => {
    setDraftState((currentDraftState) => {
      if (currentDraftState.salary === value) {
        return currentDraftState;
      }

      return {
        ...currentDraftState,
        salary: value,
      };
    });
  }, []);

  const applyFilters = useCallback(
    (overrides?: Partial<JobListDraftState>) => {
      const nextDraftState = {
        ...draftState,
        ...overrides,
      };

      if (!areDraftStatesEqual(nextDraftState, draftState)) {
        setDraftState(nextDraftState);
      }

      setCurrentSearchState((currentState) => {
        const nextSearchState: JobListSearchState = {
          ...currentState,
          experience: nextDraftState.experience,
          locationCode: nextDraftState.locationCode,
          page: 1,
          q: nextDraftState.q,
          salary: nextDraftState.salary,
          type: nextDraftState.type,
        };

        return areJobListSearchStatesEqual(nextSearchState, currentState)
          ? currentState
          : nextSearchState;
      });
    },
    [draftState]
  );

  const resetAllFilters = useCallback(() => {
    setDraftState((currentState) => {
      return areDraftStatesEqual(currentState, EMPTY_DRAFT_STATE)
        ? currentState
        : EMPTY_DRAFT_STATE;
    });

    setCurrentSearchState((currentState) => {
      const nextSearchState: JobListSearchState = {
        ...currentState,
        experience: EMPTY_DRAFT_STATE.experience,
        locationCode: EMPTY_DRAFT_STATE.locationCode,
        page: 1,
        q: EMPTY_DRAFT_STATE.q,
        salary: EMPTY_DRAFT_STATE.salary,
        sort: DEFAULT_JOB_LIST_SORT,
        type: EMPTY_DRAFT_STATE.type,
      };

      return areJobListSearchStatesEqual(nextSearchState, currentState)
        ? currentState
        : nextSearchState;
    });
  }, []);

  const resetFilterBar = useCallback(() => {
    setDraftState((currentState) => {
      if (
        currentState.type === EMPTY_DRAFT_STATE.type &&
        currentState.experience === EMPTY_DRAFT_STATE.experience &&
        currentState.salary === EMPTY_DRAFT_STATE.salary
      ) {
        return currentState;
      }

      return {
        ...currentState,
        type: EMPTY_DRAFT_STATE.type,
        experience: EMPTY_DRAFT_STATE.experience,
        salary: EMPTY_DRAFT_STATE.salary,
      };
    });

    setCurrentSearchState((currentState) => {
      const nextSearchState: JobListSearchState = {
        ...currentState,
        page: 1,
        type: EMPTY_DRAFT_STATE.type,
        experience: EMPTY_DRAFT_STATE.experience,
        salary: EMPTY_DRAFT_STATE.salary,
      };

      return areJobListSearchStatesEqual(nextSearchState, currentState)
        ? currentState
        : nextSearchState;
    });
  }, []);

  const setPage = useCallback((page: number) => {
    setCurrentSearchState((currentState) => {
      if (currentState.page === page) {
        return currentState;
      }

      return {
        ...currentState,
        page,
      };
    });
  }, []);

  const setLimit = useCallback((limit: number) => {
    setCurrentSearchState((currentState) => {
      if (currentState.limit === limit) {
        return currentState;
      }

      return {
        ...currentState,
        limit,
      };
    });
  }, []);

  const setSortBy = useCallback((sortBy: string) => {
    setCurrentSearchState((currentState) => {
      if (currentState.sort === sortBy && currentState.page === 1) {
        return currentState;
      }

      return {
        ...currentState,
        page: 1,
        sort: sortBy,
      };
    });
  }, []);

  const shouldUseInitialData =
    Boolean(initialData) &&
    areJobListSearchStatesEqual(currentSearchState, initialSearchState);

  const {
    data: jobsData,
    isLoading,
    isFetching,
  } = useGetJobsQuery(buildJobListQueryArgs(currentSearchState), {
    skip: shouldUseInitialData,
  });

  const paginatedData = shouldUseInitialData ? initialData : jobsData?.data;

  return {
    jobs: paginatedData?.result || [],
    totalItems: paginatedData?.meta?.pagination?.total || 0,
    totalPages: paginatedData?.meta?.pagination?.total_pages || 0,
    currentSearchState,
    currentPage: currentSearchState.page,
    pageSize: currentSearchState.limit,
    isLoading: shouldUseInitialData ? false : isLoading || isFetching,

    searchInput: draftState.q,
    setSearchInput,
    locationInput: draftState.locationCode,
    setLocationInput,

    searchQuery: currentSearchState.q,
    locationQuery: currentSearchState.locationCode,

    draftJobType: draftState.type,
    setDraftJobType,
    draftExperience: draftState.experience,
    setDraftExperience,
    draftSalaryRange: draftState.salary,
    setDraftSalaryRange,

    jobType: currentSearchState.type,
    experience: currentSearchState.experience,
    salaryRange: currentSearchState.salary,
    sortBy: currentSearchState.sort,
    setSortBy,

    setPage,
    setLimit,
    applyFilters,
    resetAllFilters,
    resetFilterBar,
    isDraftDirty,
  };
}
