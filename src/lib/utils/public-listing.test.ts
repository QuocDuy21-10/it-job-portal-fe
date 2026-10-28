import {
  DEFAULT_JOB_LIST_PAGE_SIZE,
  buildJobListUrlSearchParams,
  buildJobSearchParams,
  getJobListCanonicalPath,
  parseJobListSearchParams,
  toJobSearchQueryString,
  type JobListSearchState,
} from "@/lib/utils/public-listing";

const buildState = (
  overrides: Partial<JobListSearchState> = {}
): JobListSearchState => ({
  experience: "all",
  limit: DEFAULT_JOB_LIST_PAGE_SIZE,
  locationCode: "",
  page: 1,
  q: "",
  salary: "all",
  sort: "-createdAt",
  source: "all",
  type: "all",
  ...overrides,
});

describe("public-listing location normalization", () => {
  it("prefers canonical locationCode in search params", () => {
    const state = parseJobListSearchParams(
      new URLSearchParams("locationCode=ha-noi")
    );

    expect(state.locationCode).toBe("ha-noi");
    expect(buildJobSearchParams(state).locationCode).toBe("ha-noi");
  });

  it("hydrates legacy location text query params to canonical codes", () => {
    const state = parseJobListSearchParams(
      new URLSearchParams("location=Ha%20Noi")
    );

    expect(state.locationCode).toBe("ha-noi");
  });
});

describe("public-listing source", () => {
  it("parses a valid source and falls back to all", () => {
    expect(
      parseJobListSearchParams(new URLSearchParams("source=external")).source
    ).toBe("external");
    expect(
      parseJobListSearchParams(new URLSearchParams("source=abc")).source
    ).toBe("all");
    expect(parseJobListSearchParams(new URLSearchParams("")).source).toBe(
      "all"
    );
  });

  it("writes source to the URL only when it is not all", () => {
    expect(buildJobListUrlSearchParams(buildState()).has("source")).toBe(false);
    expect(
      buildJobListUrlSearchParams(buildState({ source: "internal" })).get(
        "source"
      )
    ).toBe("internal");
  });

  it("treats a source-filtered list as a non-indexable variant", () => {
    expect(getJobListCanonicalPath(buildState({ source: "external" }))).toBe(
      "/jobs"
    );
    expect(getJobListCanonicalPath(buildState({ page: 2 }))).toBe(
      "/jobs?page=2"
    );
  });
});

describe("buildJobSearchParams", () => {
  it("sends only pagination and sort for the default state", () => {
    expect(buildJobSearchParams(buildState())).toEqual({
      page: 1,
      limit: 10,
      sort: "newest",
    });
  });

  it("maps every filter to API params", () => {
    expect(
      buildJobSearchParams(
        buildState({
          q: "react",
          locationCode: "ho-chi-minh",
          type: "Full-time",
          experience: "Senior",
          salary: "10000000-20000000",
          source: "internal",
          page: 3,
          limit: 20,
        })
      )
    ).toEqual({
      keyword: "react",
      locationCode: "ho-chi-minh",
      formOfWork: "Full-time",
      level: "Senior",
      salaryMin: 10000000,
      salaryMax: 20000000,
      source: "internal",
      sort: "newest",
      page: 3,
      limit: 20,
    });
  });

  it.each([
    ["-createdAt", "newest"],
    ["createdAt", "oldest"],
    ["-salary", "salary_desc"],
    ["salary", "salary_asc"],
  ])("maps sort %s to %s", (sort, expected) => {
    expect(buildJobSearchParams(buildState({ sort })).sort).toBe(expected);
  });
});

describe("toJobSearchQueryString", () => {
  it("serializes defined params and skips undefined ones", () => {
    expect(
      toJobSearchQueryString({
        keyword: "c++",
        salaryMin: 0,
        sort: "newest",
        page: 1,
        limit: 10,
        level: undefined,
      })
    ).toBe("keyword=c%2B%2B&salaryMin=0&sort=newest&page=1&limit=10");
  });
});
