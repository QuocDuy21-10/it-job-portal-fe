import { act, renderHook } from "@testing-library/react";
import type { ListConfig } from "./types";
import { useAdminListParams } from "./use-admin-list-params";

// Next feeds history.replaceState back into useSearchParams; here it is read on each render.
jest.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(window.location.search),
}));

const config: ListConfig = {
  tabs: [
    { value: "", label: "All" },
    { value: "PENDING", label: "Pending" },
  ],
  fields: [
    {
      key: "level",
      label: "Level",
      type: "select",
      options: [{ value: "Senior", label: "Senior" }],
    },
  ],
  sorts: [{ value: "-createdAt", label: "Newest" }],
  defaultPageSize: 10,
};

describe("useAdminListParams", () => {
  beforeEach(() => window.history.replaceState(null, "", "/vi/admin/jobs"));

  it("goes back to page 1 on any change except paging", () => {
    const { result, rerender } = renderHook(() => useAdminListParams(config));
    act(() => result.current.set({ page: 3 }));
    rerender();
    expect(result.current.values.page).toBe(3);

    act(() => result.current.set({ tab: "PENDING" }));
    rerender();
    expect(result.current.values).toMatchObject({ page: 1, tab: "PENDING" });
    expect(window.location.pathname).toBe("/vi/admin/jobs");
  });

  it("does not lose a change made before the next render", () => {
    const { result, rerender } = renderHook(() => useAdminListParams(config));
    act(() => {
      result.current.set({ filters: { level: "Senior" } });
      result.current.set({ q: "java" });
    });
    rerender();
    expect(result.current.values).toMatchObject({
      q: "java",
      filters: { level: "Senior" },
    });
  });

  it("clear removes search and filters but keeps tab and page size", () => {
    window.history.replaceState(
      null,
      "",
      "/vi/admin/jobs?q=a&state=PENDING&limit=20&level=Senior&page=2"
    );
    const { result, rerender } = renderHook(() => useAdminListParams(config));
    expect(result.current.hasFilters).toBe(true);
    act(() => result.current.clear());
    rerender();
    expect(window.location.search).toBe("?state=PENDING&limit=20");
    expect(result.current.hasFilters).toBe(false);
  });
});
