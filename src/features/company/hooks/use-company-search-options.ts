import {
  useGetCompaniesQuery,
  useGetCompanyQuery,
} from "@/features/company/redux/company.api";
import { useDebounce } from "@/hooks/use-debounce";

/** Companies for a filter picker, searched on the server. */
export function useCompanySearchOptions(search: string, selectedId?: string) {
  const keyword = useDebounce(search.trim(), 300);
  const { data, isFetching } = useGetCompaniesQuery({
    page: 1,
    limit: 20,
    sort: "sort=name",
    keyword,
  });
  const options = (data?.data?.result ?? []).map(({ _id, name }) => ({
    value: _id,
    label: name,
  }));
  const listed = options.find((option) => option.value === selectedId)?.label;
  const { data: selected } = useGetCompanyQuery(selectedId ?? "", {
    skip: !selectedId || !!listed,
  });

  return {
    options,
    selectedLabel: listed ?? selected?.data?.name,
    isFetching,
  };
}
