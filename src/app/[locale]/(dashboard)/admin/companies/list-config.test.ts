import { toCompanyQuery } from "./list-config";

const base = {
  q: "",
  tab: "",
  sort: "-createdAt",
  page: 1,
  limit: 10,
  filters: {},
};
const filterOf = (filters: Record<string, string>) =>
  toCompanyQuery({ ...base, filters }).filter;

describe("toCompanyQuery", () => {
  it("searches by keyword", () => {
    expect(toCompanyQuery({ ...base, q: "FPT (HN)" })).toEqual({
      page: 1,
      limit: 10,
      sort: "sort=-createdAt",
      keyword: "FPT (HN)",
      filter: "",
    });
  });

  it("matches the location inside the address", () => {
    expect(filterOf({ location: "Hà Nội" })).toBe(
      `address=${encodeURIComponent("/Hà Nội/i")}`
    );
  });

  it("keeps size ranges apart", () => {
    expect(filterOf({ size: "s" })).toBe(
      "numberOfEmployees>=1&numberOfEmployees<=50"
    );
    expect(filterOf({ size: "m" })).toBe(
      "numberOfEmployees>=51&numberOfEmployees<=200"
    );
    expect(filterOf({ size: "l" })).toBe(
      "numberOfEmployees>=201&numberOfEmployees<=1000"
    );
    expect(filterOf({ size: "xl" })).toBe("numberOfEmployees>=1001");
  });
});
