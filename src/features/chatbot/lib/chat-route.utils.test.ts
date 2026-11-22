import { getChatJobIdFromPathname } from "./chat-route.utils";

describe("chat route utils", () => {
  it("extracts a job id from localized job detail routes", () => {
    expect(getChatJobIdFromPathname("/vi/jobs/job-123")).toBe("job-123");
    expect(getChatJobIdFromPathname("/en/jobs/abc123")).toBe("abc123");
  });

  it("extracts a job id from unlocalized job detail routes", () => {
    expect(getChatJobIdFromPathname("/jobs/job-123")).toBe("job-123");
  });

  it("returns undefined outside job detail routes", () => {
    expect(getChatJobIdFromPathname("/vi/jobs")).toBeUndefined();
    expect(getChatJobIdFromPathname("/vi/companies/company-1")).toBeUndefined();
    expect(getChatJobIdFromPathname(null)).toBeUndefined();
  });

  it("reads the id out of Vietnamese and slug URLs", () => {
    const id = "6af9ccda25a0db1ca69a68da";

    expect(getChatJobIdFromPathname(`/viec-lam/dev-go-${id}`)).toBe(id);
    expect(getChatJobIdFromPathname(`/en/jobs/dev-go-${id}`)).toBe(id);
    expect(getChatJobIdFromPathname("/viec-lam")).toBeUndefined();
    expect(getChatJobIdFromPathname("/cong-ty/acme-1")).toBeUndefined();
  });
});
