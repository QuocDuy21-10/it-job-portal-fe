import {
  dateFilter,
  parseDateRange,
  parseListParams,
  serializeListParams,
} from "./list-params";
import type { ListConfig } from "./types";

const ID = "507f1f77bcf86cd799439011";
const config: ListConfig = {
  tabs: [
    { value: "", label: "All" },
    { value: "PENDING", label: "Pending" },
  ],
  fields: [
    {
      key: "level",
      label: "Level",
      type: "multi",
      options: ["Junior", "Senior"].map((v) => ({ value: v, label: v })),
    },
    {
      key: "salary",
      label: "Salary",
      type: "select",
      options: [{ value: "lt10", label: "<10" }],
    },
    { key: "skills", label: "Skills", type: "multi", options: [] },
    { key: "created", label: "Created", type: "date" },
    {
      key: "company",
      label: "Company",
      type: "entity",
      useOptions: () => ({ options: [], isFetching: false }),
    },
  ],
  sorts: [
    { value: "-createdAt", label: "Newest" },
    { value: "name", label: "Name" },
  ],
  defaultPageSize: 10,
};
const parse = (query: string) =>
  parseListParams(new URLSearchParams(query), config);

describe("parseListParams", () => {
  it("returns defaults for an empty URL", () => {
    expect(parse("")).toEqual({
      q: "",
      tab: "",
      sort: "-createdAt",
      page: 1,
      limit: 10,
      filters: {},
    });
  });

  it("reads known values", () => {
    expect(
      parse(
        `q=c%2B%2B&state=PENDING&sort=name&page=3&limit=20&level=Junior,Senior&salary=lt10&created=7d&company=${ID}`
      )
    ).toEqual({
      q: "c++",
      tab: "PENDING",
      sort: "name",
      page: 3,
      limit: 20,
      filters: {
        level: "Junior,Senior",
        salary: "lt10",
        created: "7d",
        company: ID,
      },
    });
  });

  it("drops anything it does not know", () => {
    expect(
      parse(
        "state=X&sort=password&page=-1&limit=7&level=Junior,Boss&salary=x&created=soon&company=../users&other=1"
      )
    ).toEqual({ ...parse(""), filters: { level: "Junior" } });
    expect(parse(`q=${"a".repeat(150)}`).q).toHaveLength(100);
  });

  it("keeps values of a field whose options have not loaded", () => {
    expect(parse("skills=React").filters).toEqual({ skills: "React" });
  });
});

describe("serializeListParams", () => {
  const write = (patch: object, current = "") =>
    serializeListParams(
      { ...parse(""), ...patch },
      config,
      new URLSearchParams(current)
    );

  it("leaves defaults out and keeps params it does not own", () => {
    expect(write({})).toBe("");
    expect(write({ page: 2 }, "tab=jobs&state=PENDING&level=Junior")).toBe(
      "tab=jobs&page=2"
    );
  });

  it("round-trips", () => {
    const values = {
      q: "C++ & C#",
      tab: "PENDING",
      sort: "name",
      page: 2,
      limit: 50,
      filters: { level: "Junior,Senior", created: "2026-11-01.." },
    };
    expect(
      parse(serializeListParams(values, config, new URLSearchParams()))
    ).toEqual(values);
  });
});

describe("dates", () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 10, 25, 15, 30));
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  it("turns 7d into today and the six days before", () => {
    expect(parseDateRange("7d")).toEqual({
      from: new Date(2026, 10, 19),
      to: new Date(2026, 10, 25, 23, 59, 59, 999),
    });
  });

  it("accepts open ranges and rejects reversed or invalid ones", () => {
    expect(parseDateRange("2026-11-01..")).toEqual({
      from: new Date(2026, 10, 1),
      to: undefined,
    });
    for (const value of [
      "..",
      "2026-11-02..2026-11-01",
      "2026-13-01..",
      "1d",
      "",
    ]) {
      expect(parseDateRange(value)).toBeUndefined();
    }
  });

  it("builds an inclusive filter", () => {
    expect(dateFilter("createdAt", "2026-11-01..2026-11-02")).toEqual([
      `createdAt>=${new Date(2026, 10, 1).toISOString()}`,
      `createdAt<=${new Date(2026, 10, 2, 23, 59, 59, 999).toISOString()}`,
    ]);
    expect(dateFilter("createdAt", undefined)).toEqual([]);
  });
});
