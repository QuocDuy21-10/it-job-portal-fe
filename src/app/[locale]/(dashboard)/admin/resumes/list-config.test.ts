import { buildResumeListConfig, toResumeQuery } from "./list-config";

const t = (key: string) => key;
const base = {
  q: "",
  tab: "",
  sort: "-createdAt",
  page: 1,
  limit: 10,
  filters: {},
};
const ID = "507f1f77bcf86cd799439011";
const filterOf = (filters: Record<string, string>) =>
  toResumeQuery({ ...base, filters }).filter;

describe("toResumeQuery", () => {
  it("sends the tab as status and search as keyword", () => {
    expect(
      toResumeQuery({ ...base, q: "a+b@x.vn", tab: "INTERVIEWING" })
    ).toEqual({
      page: 1,
      limit: 10,
      sort: "sort=-createdAt",
      keyword: "a+b@x.vn",
      filter: "status=INTERVIEWING",
    });
  });

  it("maps every filter", () => {
    expect(filterOf({ job: ID, company: ID, priority: "HIGH,EXCELLENT" })).toBe(
      `jobId=${ID}&companyId=${ID}&priority=HIGH%2CEXCELLENT`
    );
  });

  it("leaves no gap between score ranges", () => {
    expect(filterOf({ score: "excellent" })).toBe(
      "aiAnalysis.matchingScore>=80"
    );
    expect(filterOf({ score: "good" })).toBe(
      "aiAnalysis.matchingScore>=60&aiAnalysis.matchingScore<=79.99"
    );
    expect(filterOf({ score: "average" })).toBe(
      "aiAnalysis.matchingScore>=40&aiAnalysis.matchingScore<=59.99"
    );
    expect(filterOf({ score: "low" })).toBe("aiAnalysis.matchingScore<=39.99");
  });
});

it("hides the company filter from HR", () => {
  const keys = (isAdmin: boolean) =>
    buildResumeListConfig(t, { isAdmin }).fields.map((field) => field.key);
  expect(keys(true)).toContain("company");
  expect(keys(false)).not.toContain("company");
});
