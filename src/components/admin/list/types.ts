export type Option = { value: string; label: string };

// Must be a module-level hook: it is called while rendering the field and its chip.
export type UseEntityOptions = (
  search: string,
  selectedId?: string
) => { options: Option[]; selectedLabel?: string; isFetching: boolean };

export type FilterField = { key: string; label: string } & (
  | { type: "select"; options: Option[]; emptyLabel?: string } // emptyLabel: text for "no value"
  | { type: "multi"; options: Option[] }
  | { type: "date" } // "7d" | "30d" | "YYYY-MM-DD..YYYY-MM-DD" (either end may be empty)
  | { type: "entity"; useOptions: UseEntityOptions }
);

export type ListTab = Option & { tone?: "warning" };

export type ListConfig = {
  tabs?: ListTab[]; // "" is All
  fields: FilterField[];
  sorts: Option[]; // the first is the default
  defaultPageSize: number;
};

export type ListValues = {
  q: string;
  tab: string;
  sort: string;
  page: number;
  limit: number;
  filters: Record<string, string>; // multi values are joined with ","
};

// Total of the list for these values; undefined while unknown.
export type UseListTotal = (
  values: ListValues,
  skip: boolean
) => number | undefined;
