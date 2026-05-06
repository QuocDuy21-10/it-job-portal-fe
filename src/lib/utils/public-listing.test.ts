import {
  buildJobListFilter,
  parseJobListSearchParams,
} from "@/lib/utils/public-listing";

describe("public-listing location normalization", () => {
  it("prefers canonical locationCode in search params", () => {
    const state = parseJobListSearchParams(
      new URLSearchParams("locationCode=ha-noi")
    );

    expect(state.locationCode).toBe("ha-noi");
    expect(buildJobListFilter(state)).toContain("locationCode=ha-noi");
  });

  it("hydrates legacy location text query params to canonical codes", () => {
    const state = parseJobListSearchParams(
      new URLSearchParams("location=Ha%20Noi")
    );

    expect(state.locationCode).toBe("ha-noi");
  });
});
