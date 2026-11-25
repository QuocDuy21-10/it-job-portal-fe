import { between, buildListUrl, equals } from "./list-url";

describe("buildListUrl", () => {
  it("encodes the keyword and skips empty parts", () => {
    expect(
      buildListUrl("/jobs", {
        page: 2,
        limit: 20,
        filter: "level=Senior",
        sort: "",
        keyword: "C++ & C#",
        state: "PENDING",
      })
    ).toBe(
      "/jobs?page=2&limit=20&level=Senior&keyword=C%2B%2B%20%26%20C%23&state=PENDING"
    );
    expect(buildListUrl("/users", { page: 1, limit: 10 })).toBe(
      "/users?page=1&limit=10"
    );
  });
});

describe("equals and between", () => {
  it("encodes values and skips missing ones", () => {
    expect(equals("skills", "C++,C#")).toEqual(["skills=C%2B%2B%2CC%23"]);
    expect(equals("skills", "")).toEqual([]);
    expect(between("salary", 0, 9_999_999)).toEqual([
      "salary>=0",
      "salary<=9999999",
    ]);
    expect(between("salary", undefined, 5)).toEqual(["salary<=5"]);
  });
});
