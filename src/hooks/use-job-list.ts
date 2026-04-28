import { useEffect, useRef, useState } from "react";
import { useGetJobsQuery } from "@/features/job/redux/job.api";
import type { Job } from "@/features/job/schemas/job.schema";
import {
  areJobListSearchStatesEqual,
  buildJobListQueryArgs,
  type JobListSearchState,
} from "@/lib/utils/public-listing";
import type { PaginatedResult } from "@/shared/types/pagination";

interface UseJobListProps {
  initialData?: PaginatedResult<Job> | null;
  initialPage?: number;
  initialLimit?: number;
  initialSearch?: string;
  initialLocation?: string;
  initialJobType?: string;
  initialExperience?: string;
  initialSalaryRange?: string;
  initialSort?: string;
}

export function useJobList({
  initialData,
  initialPage = 1,
  initialLimit = 10,
  initialSearch = "",
  initialLocation = "",
  initialJobType = "all",
  initialExperience = "all",
  initialSalaryRange = "all",
  initialSort = "-createdAt",
}: UseJobListProps = {}) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const hasMountedSearchInput = useRef(false);
  const hasMountedLocationInput = useRef(false);
  const hasMountedFilters = useRef(false);

  // Input states for immediate UI updates
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [locationInput, setLocationInput] = useState(initialLocation);

  // Debounced states for API calls
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [locationQuery, setLocationQuery] = useState(initialLocation);

  const [jobType, setJobType] = useState(initialJobType);
  const [experience, setExperience] = useState(initialExperience);
  const [salaryRange, setSalaryRange] = useState(initialSalaryRange);
  const [sortBy, setSortBy] = useState(initialSort);

  // Debounce search and location inputs
  useEffect(() => {
    if (!hasMountedSearchInput.current) {
      hasMountedSearchInput.current = true;
      return;
    }

    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (!hasMountedLocationInput.current) {
      hasMountedLocationInput.current = true;
      return;
    }

    const timer = setTimeout(() => {
      setLocationQuery(locationInput);
      setPage(1); // Reset to first page on location change
    }, 500);

    return () => clearTimeout(timer);
  }, [locationInput]);

  // Reset to first page when filters change
  useEffect(() => {
    if (!hasMountedFilters.current) {
      hasMountedFilters.current = true;
      return;
    }

    setPage(1);
  }, [jobType, experience, salaryRange, sortBy]);

  const initialSearchState: JobListSearchState = {
    experience: initialExperience,
    limit: initialLimit,
    location: initialLocation,
    page: initialPage,
    q: initialSearch,
    salary: initialSalaryRange,
    sort: initialSort,
    type: initialJobType,
  };

  const currentSearchState: JobListSearchState = {
    experience,
    limit,
    location: locationQuery,
    page,
    q: searchQuery,
    salary: salaryRange,
    sort: sortBy,
    type: jobType,
  };

  const shouldUseInitialData =
    Boolean(initialData) &&
    areJobListSearchStatesEqual(currentSearchState, initialSearchState);

  // Get jobs with RTK Query
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
    currentPage: page,
    pageSize: limit,
    isLoading: shouldUseInitialData ? false : isLoading || isFetching,

    // Search & Location with immediate UI update
    searchInput,
    setSearchInput,
    locationInput,
    setLocationInput,

    // Actual query values (debounced)
    searchQuery,
    locationQuery,

    // Filters
    jobType,
    setJobType,
    experience,
    setExperience,
    salaryRange,
    setSalaryRange,
    sortBy,
    setSortBy,

    // Pagination
    setPage,
    setLimit,
  };
}
