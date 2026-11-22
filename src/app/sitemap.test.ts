import sitemap from "./sitemap";
import {
  fetchAllPublicCompanies,
  fetchAllPublicJobs,
} from "@/lib/utils/public-content";

jest.mock("next/server", () => ({
  connection: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/i18n/routing", () => ({
  routing: { locales: ["en", "vi"], defaultLocale: "en" },
}));

jest.mock("@/lib/utils/public-content", () => ({
  fetchAllPublicJobs: jest.fn(),
  fetchAllPublicCompanies: jest.fn(),
}));

const SITE = "http://localhost:3000";

describe("sitemap.xml", () => {
  it("lists static pages, every job and every company with their real lastmod", async () => {
    jest.mocked(fetchAllPublicJobs).mockResolvedValue([
      { _id: "j1", updatedAt: "2026-11-02T00:00:00.000Z" },
      { _id: "j2", createdAt: "2026-11-05T00:00:00.000Z" },
    ] as never);
    jest
      .mocked(fetchAllPublicCompanies)
      .mockResolvedValue([
        { _id: "c1", updatedAt: "2026-10-01T00:00:00.000Z" },
      ] as never);

    const entries = await sitemap();

    expect(entries.map(({ url, lastModified }) => [url, lastModified])).toEqual(
      [
        [`${SITE}/`, "2026-11-05T00:00:00.000Z"],
        [`${SITE}/jobs`, "2026-11-05T00:00:00.000Z"],
        [`${SITE}/companies`, "2026-10-01T00:00:00.000Z"],
        [`${SITE}/jobs/j1`, "2026-11-02T00:00:00.000Z"],
        [`${SITE}/jobs/j2`, "2026-11-05T00:00:00.000Z"],
        [`${SITE}/companies/c1`, "2026-10-01T00:00:00.000Z"],
      ]
    );
    expect(entries[3].alternates?.languages).toEqual({
      en: `${SITE}/jobs/j1`,
      vi: `${SITE}/vi/jobs/j1`,
      "x-default": `${SITE}/jobs/j1`,
    });
    expect(entries[0]).not.toHaveProperty("changeFrequency");
    expect(entries[0]).not.toHaveProperty("priority");
  });

  it("leaves lastmod out rather than inventing one", async () => {
    jest.mocked(fetchAllPublicJobs).mockResolvedValue([{ _id: "j1" }] as never);
    jest.mocked(fetchAllPublicCompanies).mockResolvedValue([] as never);

    const entries = await sitemap();

    expect(entries[0]).not.toHaveProperty("lastModified");
    expect(entries[2]).not.toHaveProperty("lastModified");
    expect(entries[3]).not.toHaveProperty("lastModified");
  });

  it("fails instead of publishing a sitemap with jobs missing", async () => {
    jest
      .mocked(fetchAllPublicJobs)
      .mockRejectedValue(new Error("Backend answered 503 for /jobs"));
    jest.mocked(fetchAllPublicCompanies).mockResolvedValue([] as never);

    await expect(sitemap()).rejects.toThrow("503");
  });
});
