import { buildUserListConfig, toUserQuery } from "./list-config";

const base = {
  q: "",
  tab: "",
  sort: "-createdAt",
  page: 1,
  limit: 10,
  filters: {},
};
const query = (patch: object) => toUserQuery({ ...base, ...patch });

describe("toUserQuery", () => {
  it("always sorts and searches by keyword", () => {
    expect(query({ q: "a&b" })).toEqual({
      page: 1,
      limit: 10,
      sort: "sort=-createdAt",
      keyword: "a&b",
      filter: "",
    });
  });

  it("maps role tabs and the locked tab", () => {
    expect(query({ tab: "NORMAL USER" }).filter).toBe("role=NORMAL%20USER");
    expect(query({ tab: "LOCKED" }).filter).toBe("isLocked=true");
  });

  it("maps every filter", () => {
    expect(
      query({
        filters: {
          verified: "false",
          provider: "google",
          company: "507f1f77bcf86cd799439011",
        },
      }).filter
    ).toBe(
      "isActive=false&authProvider=google&company._id=507f1f77bcf86cd799439011"
    );
  });
});

it("uses the API's count keys as tab values", () => {
  expect(
    buildUserListConfig((key) => key).tabs?.map(({ value }) => value)
  ).toEqual(["", "NORMAL USER", "HR", "SUPER ADMIN", "LOCKED"]);
});
