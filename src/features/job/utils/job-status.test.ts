import { getJobStatus } from "./job-status";

const DAY_MS = 24 * 60 * 60 * 1000;

describe("getJobStatus", () => {
  it("marks active jobs ending within 7 days as closing", () => {
    expect(
      getJobStatus({
        endDate: new Date(Date.now() + 3 * DAY_MS).toISOString(),
        isActive: true,
      })?.variant
    ).toBe("closing");
  });

  it("ignores endDate when the job is not active", () => {
    expect(
      getJobStatus({
        endDate: new Date(Date.now() + 3 * DAY_MS).toISOString(),
        isActive: false,
      })
    ).toBeNull();
  });

  it("marks jobs created within 3 days as new", () => {
    expect(
      getJobStatus({ createdAt: new Date(Date.now() - DAY_MS).toISOString() })
        ?.variant
    ).toBe("new");
  });

  it("returns null without dates", () => {
    expect(getJobStatus({})).toBeNull();
  });
});
