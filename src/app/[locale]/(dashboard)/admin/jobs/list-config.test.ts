import { buildJobListConfig, toJobQuery } from "./list-config";

const t = (key: string) => key;
const base = {
  q: "",
  tab: "",
  sort: "-createdAt",
  page: 1,
  limit: 10,
  filters: {},
};
const filterOf = (filters: Record<string, string>) =>
  toJobQuery({ ...base, filters }).filter;

describe("toJobQuery", () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 10, 25, 15, 30));
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  it("sends paging, sort, keyword and state", () => {
    expect(
      toJobQuery({ ...base, q: "C++", tab: "PENDING", page: 2, limit: 20 })
    ).toEqual({
      page: 2,
      limit: 20,
      sort: "sort=-createdAt",
      keyword: "C++",
      state: "PENDING",
      filter: "",
    });
  });

  it("maps every filter", () => {
    expect(
      filterOf({
        location: "ha-noi,da-nang",
        level: "Senior,Lead",
        formOfWork: "Remote",
        skills: "C++,C#",
        company: "507f1f77bcf86cd799439011",
      })
    ).toBe(
      "locationCode=ha-noi%2Cda-nang&level=Senior%2CLead&formOfWork=Remote&skills=C%2B%2B%2CC%23&company._id=507f1f77bcf86cd799439011"
    );
  });

  it("keeps salary ranges apart at their edges", () => {
    expect(filterOf({ salary: "lt10" })).toBe("salary<=9999999");
    expect(filterOf({ salary: "10-20" })).toBe(
      "salary>=10000000&salary<=19999999"
    );
    expect(filterOf({ salary: "20-50" })).toBe(
      "salary>=20000000&salary<=49999999"
    );
    expect(filterOf({ salary: "gte50" })).toBe("salary>=50000000");
  });

  it("turns dates into whole local days", () => {
    expect(filterOf({ created: "7d" })).toBe(
      `createdAt>=${new Date(2026, 10, 19).toISOString()}&createdAt<=${new Date(2026, 10, 25, 23, 59, 59, 999).toISOString()}`
    );
    expect(filterOf({ expiring: "7" })).toBe(
      `endDate>=${new Date(2026, 10, 25).toISOString()}&endDate<=${new Date(2026, 11, 2, 23, 59, 59, 999).toISOString()}`
    );
  });
});

describe("buildJobListConfig", () => {
  const keys = (isAdmin: boolean) =>
    buildJobListConfig(t, { isAdmin, skillOptions: [] }).fields.map(
      (field) => field.key
    );

  it("hides the company filter from HR", () => {
    expect(keys(true)).toContain("company");
    expect(keys(false)).not.toContain("company");
  });
});
