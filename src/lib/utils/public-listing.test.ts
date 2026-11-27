import {
  DEFAULT_COMPANY_LIST_PAGE_SIZE,
  DEFAULT_COMPANY_LIST_SORT,
  DEFAULT_JOB_LIST_PAGE_SIZE,
  buildCompanyListQueryArgs,
  buildCompanyListUrlSearchParams,
  buildJobListUrlSearchParams,
  buildJobSearchParams,
  getCompanyListCanonicalPath,
  getJobListCanonicalPath,
  parseCompanyListSearchParams,
  parseJobListSearchParams,
  toJobSearchQueryString,
  type CompanyListSearchState,
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
    expect(
      getJobListCanonicalPath(buildState({ source: "external" }))
    ).toBeNull();
    expect(getJobListCanonicalPath(buildState({ page: 2 }))).toEqual({
      pathname: "/jobs",
      query: { page: "2" },
    });
    expect(getJobListCanonicalPath(buildState())).toBe("/jobs");
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

const companyState = (
  overrides: Partial<CompanyListSearchState> = {}
): CompanyListSearchState => ({
  limit: DEFAULT_COMPANY_LIST_PAGE_SIZE,
  page: 1,
  q: "",
  industry: "",
  size: "",
  sort: DEFAULT_COMPANY_LIST_SORT,
  ...overrides,
});

describe("company list URL state", () => {
  it("reads industry, size and sort, and drops unknown values", () => {
    expect(
      parseCompanyListSearchParams({
        industry: "FINTECH_BANKING",
        size: "m",
        sort: "name",
      })
    ).toEqual(
      companyState({ industry: "FINTECH_BANKING", size: "m", sort: "name" })
    );
    expect(
      parseCompanyListSearchParams({
        industry: "GAMBLING",
        size: "xxl",
        sort: "-totalJobs",
      })
    ).toEqual(companyState());
  });

  it("writes only non-default values to the URL", () => {
    expect(buildCompanyListUrlSearchParams(companyState()).toString()).toBe("");
    expect(
      buildCompanyListUrlSearchParams(
        companyState({
          q: "fpt",
          industry: "TELECOM",
          size: "xl",
          sort: "name",
          page: 2,
        })
      ).toString()
    ).toBe("q=fpt&industry=TELECOM&size=xl&sort=name&page=2");
  });

  it("asks the API for the industry, size range and sort", () => {
    expect(
      buildCompanyListQueryArgs(
        companyState({ industry: "TELECOM", size: "m" })
      )
    ).toEqual({
      filter: "industry=TELECOM&numberOfEmployees>=51&numberOfEmployees<=200",
      sort: "sort=-createdAt",
      limit: DEFAULT_COMPANY_LIST_PAGE_SIZE,
      page: 1,
    });
    expect(buildCompanyListQueryArgs(companyState({ size: "xl" })).filter).toBe(
      "numberOfEmployees>=1001"
    );
  });

  it("keeps filtered and re-sorted lists out of the index", () => {
    expect(
      getCompanyListCanonicalPath(companyState({ industry: "TELECOM" }))
    ).toBeNull();
    expect(getCompanyListCanonicalPath(companyState({ size: "s" }))).toBeNull();
    expect(
      getCompanyListCanonicalPath(companyState({ sort: "name" }))
    ).toBeNull();
    expect(getCompanyListCanonicalPath(companyState())).toBe("/companies");
  });
});

describe("getCompanyListCanonicalPath", () => {
  it("returns null for a search and keeps plain pagination canonical", () => {
    expect(getCompanyListCanonicalPath(companyState({ q: "fpt" }))).toBeNull();
    expect(getCompanyListCanonicalPath(companyState({ page: 3 }))).toEqual({
      pathname: "/companies",
      query: { page: "3" },
    });
  });
});
