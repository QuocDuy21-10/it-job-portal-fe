import type { JobListSearchState } from "@/lib/utils/public-listing";
import { getJobFilterSummary } from "./job-filter-summary";

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

describe("getJobFilterSummary", () => {
  it("reports nothing applied for the default state", () => {
    expect(getJobFilterSummary(base, false)).toEqual({
      activeFiltersCount: 0,
      hasAppliedFilters: false,
      hasResettableState: false,
      showExternalFilterHint: false,
    });
  });

  it("counts only type, experience and salary as active filters", () => {
    const summary = getJobFilterSummary(
      {
        ...base,
        type: "Hybrid",
        experience: "Senior",
        salary: "0-10000000",
        q: "react",
      },
      false
    );
    expect(summary.activeFiltersCount).toBe(3);
  });

  it.each([
    ["q", { q: "react" }],
    ["locationCode", { locationCode: "79" }],
    ["sort", { sort: "salary" }],
    ["source", { source: "external" as const }],
  ])("treats a changed %s as an applied filter", (_, override) => {
    expect(
      getJobFilterSummary({ ...base, ...override }, false).hasAppliedFilters
    ).toBe(true);
  });

  it("marks state resettable when only the draft is dirty", () => {
    expect(getJobFilterSummary(base, true).hasResettableState).toBe(true);
  });

  it("shows the external hint only when filters drop external jobs", () => {
    expect(
      getJobFilterSummary({ ...base, salary: "0-10000000" }, false)
        .showExternalFilterHint
    ).toBe(true);
    expect(
      getJobFilterSummary({ ...base, type: "Full-time" }, false)
        .showExternalFilterHint
    ).toBe(true);
    expect(
      getJobFilterSummary({ ...base, type: "Remote" }, false)
        .showExternalFilterHint
    ).toBe(false);
    expect(
      getJobFilterSummary(
        { ...base, source: "internal", salary: "0-10000000" },
        false
      ).showExternalFilterHint
    ).toBe(false);
  });
});
