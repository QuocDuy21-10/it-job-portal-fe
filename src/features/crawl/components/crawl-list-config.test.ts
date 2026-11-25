import {
  buildFailuresConfig,
  toCrawledJobsParams,
  toFailuresParams,
} from "./crawl-list-config";

const base = { q: "", tab: "", sort: "", page: 1, limit: 20, filters: {} };
const t = (key: string) => key;

describe("toCrawledJobsParams", () => {
  it("leaves unset filters undefined", () => {
    expect(toCrawledJobsParams(base)).toEqual({
      page: 1,
      limit: 20,
      keyword: "",
      state: undefined,
      sourceKey: undefined,
      from: undefined,
      to: undefined,
    });
  });

  it("maps tab, source, keyword and dates", () => {
    expect(
      toCrawledJobsParams({
        ...base,
        q: "c++",
        tab: "REMOVED",
        filters: { source: "topdev", crawled: "2026-11-01..2026-11-02" },
      })
    ).toEqual({
      page: 1,
      limit: 20,
      keyword: "c++",
      state: "REMOVED",
      sourceKey: "topdev",
      from: new Date(2026, 10, 1).toISOString(),
      to: new Date(2026, 10, 2, 23, 59, 59, 999).toISOString(),
    });
  });
});

describe("failures", () => {
  it("sends a reason only in the error group", () => {
    const filters = { source: "topdev", reason: "FETCH_ERROR" };
    expect(toFailuresParams({ ...base, tab: "error", filters })).toMatchObject({
      group: "error",
      sourceKey: "topdev",
      reason: "FETCH_ERROR",
    });
    expect(
      toFailuresParams({ ...base, tab: "filtered", filters })
    ).toMatchObject({ group: "filtered", reason: undefined });
  });

  it("offers the reason filter only in the error group", () => {
    const keys = (group: string) =>
      buildFailuresConfig(t, [], group).fields.map((field) => field.key);
    expect(keys("error")).toEqual(["source", "reason", "failed"]);
    expect(keys("filtered")).toEqual(["source", "failed"]);
  });
});
