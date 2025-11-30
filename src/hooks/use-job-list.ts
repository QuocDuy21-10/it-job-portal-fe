import { useState, useEffect } from "react";
import { useGetJobsQuery } from "@/features/job/redux/job.api";

interface UseJobListProps {
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
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocationQuery(locationInput);
      setPage(1); // Reset to first page on location change
    }, 500);

    return () => clearTimeout(timer);
  }, [locationInput]);

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [jobType, experience, salaryRange, sortBy]);

  // Construct filter string
  const getFilterString = () => {
    const filters = [`isActive=true`];

    if (searchQuery) {
      filters.push(`name=/${searchQuery}/i`);
    }

    if (locationQuery) {
      filters.push(`location=/${locationQuery}/i`);
    }

    if (jobType !== "all") {
      filters.push(`formOfWork=${jobType}`);
    }

    if (experience !== "all") {
      filters.push(`level=${experience}`);
    }

    // Salary range filter (format giống admin page)
    if (salaryRange !== "all") {
      const [min, max] = salaryRange.split("-");
      if (min) filters.push(`salary>=${min}`);
      if (max) filters.push(`salary<=${max}`);
    }

    return filters.join("&");
  };

  // Construct sort string
  const getSortString = () => {
    return `sort=${sortBy}`;
  };

  // Get jobs with RTK Query
  const {
    data: jobsData,
    isLoading,
    isFetching,
  } = useGetJobsQuery({
    page,
    limit,
    filter: getFilterString(),
    sort: getSortString(),
  });

  return {
    jobs: jobsData?.data?.result || [],
    totalItems: jobsData?.data?.meta?.pagination?.total || 0,
    totalPages: jobsData?.data?.meta?.pagination?.total_pages || 0,
    currentPage: page,
    pageSize: limit,
    isLoading: isLoading || isFetching,

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
