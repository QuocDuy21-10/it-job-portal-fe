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

  describe("location", () => {
    // What the API does with "/a/i,/b/i": any of the literals, any case.
    const finds = (location: string, address: string) =>
      decodeURIComponent(filterOf({ location })!.replace("address=", ""))
        .split(",")
        .some((part) =>
          address.toLowerCase().includes(part.slice(1, -2).toLowerCase())
        );

    it.each([
      ["Hà Nội", "17 Duy Tan, Cau Giay, Ha Noi"],
      ["Hà Nội", "17 Duy Tân, Cầu Giấy, Hà Nội"],
      ["Hà Nội", "Dong Da, Hanoi"],
      ["TP. Hồ Chí Minh", "District 1, Ho Chi Minh City"],
      ["TP. Hồ Chí Minh", "Quận 1, TP.HCM"],
      ["TP. Hồ Chí Minh", "Quận 1, Thành phố Hồ Chí Minh"],
    ])("%s finds %s", (location, address) => {
      expect(finds(location, address)).toBe(true);
    });

    it("does not take a street name for a province", () => {
      expect(finds("Thừa Thiên - Huế", "35 Nguyen Hue, Ho Chi Minh City")).toBe(
        false
      );
    });
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
