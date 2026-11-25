"use client";

import { useSearchParams } from "next/navigation";
import { parseListParams, serializeListParams } from "./list-params";
import type { ListConfig, ListValues } from "./types";

/** List state kept in the URL. The page using it needs a Suspense boundary. */
export function useAdminListParams(config: ListConfig) {
  const searchParams = useSearchParams();
  const values = parseListParams(
    new URLSearchParams(searchParams.toString()),
    config
  );

  const set = (patch: Partial<ListValues>) => {
    // Read the live URL, not this render's values: two quick changes must both stay.
    const current = new URLSearchParams(window.location.search);
    const next = { ...parseListParams(current, config), page: 1, ...patch };
    const query = serializeListParams(next, config, current);
    const { pathname } = window.location;
    // No navigation: Next syncs useSearchParams with replaceState.
    window.history.replaceState(
      null,
      "",
      query ? `${pathname}?${query}` : pathname
    );
  };

  return {
    values,
    set,
    clear: () => set({ q: "", filters: {} }),
    hasFilters: values.q !== "" || Object.keys(values.filters).length > 0,
  };
}
