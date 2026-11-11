import { renderHook } from "@testing-library/react";
import type { MutableRefObject } from "react";
import type { JobListSearchState } from "@/lib/utils/public-listing";
import { useJobListUrlSync } from "./use-job-list-url-sync";

const mockReplace = jest.fn();
let mockQueryString = "";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => "/jobs",
  useSearchParams: () => new URLSearchParams(mockQueryString),
}));

const base: JobListSearchState = {
  experience: "all",
  limit: 10,
  locationCode: "",
  page: 1,
  q: "",
  salary: "all",
  sort: "-createdAt",
  source: "all",
  type: "all",
};

describe("useJobListUrlSync", () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockQueryString = "";
    window.scrollTo = jest.fn();
  });

  it("does not replace the URL when it already matches the state", () => {
    renderHook(() => useJobListUrlSync(base));
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("replaces the URL without scrolling when the state differs", () => {
    renderHook(() => useJobListUrlSync({ ...base, type: "Remote" }));
    expect(mockReplace).toHaveBeenCalledWith("/jobs?type=Remote", {
      scroll: false,
    });
  });

  it("skips scrolling on first mount and scrolls once the page changes", () => {
    const { result, rerender } = renderHook(
      ({ state }) => useJobListUrlSync(state),
      { initialProps: { state: base } }
    );
    (result.current as MutableRefObject<HTMLDivElement | null>).current =
      document.createElement("div");

    expect(window.scrollTo).not.toHaveBeenCalled();

    rerender({ state: { ...base, page: 2 } });

    // jsdom reports top 0, so the 84px offset clamps to 0.
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });
});
