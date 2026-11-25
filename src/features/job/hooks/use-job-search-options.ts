import { useGetJobQuery, useGetJobsQuery } from "@/features/job/redux/job.api";
import type { Job } from "@/features/job/schemas/job.schema";
import { useDebounce } from "@/hooks/use-debounce";

/** Jobs for a filter picker, searched on the server inside the caller's scope. */
export function useJobSearchOptions(search: string, selectedId?: string) {
  const keyword = useDebounce(search.trim(), 300);
  const { data, isFetching } = useGetJobsQuery({
    page: 1,
    limit: 20,
    sort: "sort=-createdAt",
    keyword,
  });
  const options = (data?.data?.result ?? []).map((job: Job) => ({
    value: job._id,
    label: job.company?.name ? `${job.name} · ${job.company.name}` : job.name,
  }));
  const listed = options.find((option) => option.value === selectedId)?.label;
  const { data: selected } = useGetJobQuery(selectedId ?? "", {
    skip: !selectedId || !!listed,
  });

  return {
    options,
    selectedLabel: listed ?? selected?.data?.name,
    isFetching,
  };
}
