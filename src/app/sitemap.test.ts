import sitemap from "./sitemap";
import {
  fetchAllPublicCompanies,
  fetchAllPublicJobs,
} from "@/lib/utils/public-content";

jest.mock("next/server", () => ({
  connection: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/lib/utils/public-content", () => ({
  fetchAllPublicJobs: jest.fn(),
  fetchAllPublicCompanies: jest.fn(),
}));

const SITE = "http://localhost:3000";

describe("sitemap.xml", () => {
  it("lists static pages, every job and every company with their real lastmod", async () => {
    jest.mocked(fetchAllPublicJobs).mockResolvedValue([
      {
        _id: "j1",
        name: "Dev One",
        updatedAt: "2026-11-02T00:00:00.000Z",
        skills: ["React"],
        locationCode: "ha-noi",
        level: "Senior",
      },
      {
        _id: "j2",
        name: "Dev Two",
        createdAt: "2026-11-05T00:00:00.000Z",
        skills: ["Go"],
        locationCode: "ha-noi",
        level: "Junior",
      },
    ] as never);
    jest
      .mocked(fetchAllPublicCompanies)
      .mockResolvedValue([
        { _id: "c1", name: "Acme", updatedAt: "2026-10-01T00:00:00.000Z" },
      ] as never);

    const entries = await sitemap();

    expect(entries.map(({ url, lastModified }) => [url, lastModified])).toEqual(
      [
        [`${SITE}/`, "2026-11-05T00:00:00.000Z"],
        [`${SITE}/viec-lam`, "2026-11-05T00:00:00.000Z"],
        [`${SITE}/cong-ty`, "2026-10-01T00:00:00.000Z"],
        [`${SITE}/viec-lam/dev-one-j1`, "2026-11-02T00:00:00.000Z"],
        [`${SITE}/viec-lam/dev-two-j2`, "2026-11-05T00:00:00.000Z"],
        [`${SITE}/cong-ty/acme-c1`, "2026-10-01T00:00:00.000Z"],
      ]
    );
    expect(entries[3].alternates?.languages).toEqual({
      vi: `${SITE}/viec-lam/dev-one-j1`,
      en: `${SITE}/en/jobs/dev-one-j1`,
      "x-default": `${SITE}/viec-lam/dev-one-j1`,
    });
    expect(entries[0]).not.toHaveProperty("changeFrequency");
    expect(entries[0]).not.toHaveProperty("priority");
  });

  it("adds landing pages with at least 5 matching internal jobs", async () => {
    const jobs = Array.from({ length: 5 }, (_, index) => ({
      _id: `j${index}`,
      name: `Dev ${index}`,
      updatedAt: `2026-11-0${index + 1}T00:00:00.000Z`,
      skills: ["react"],
      locationCode: "da-nang",
      level: "Lead",
    }));
    jest.mocked(fetchAllPublicJobs).mockResolvedValue(jobs as never);
    jest.mocked(fetchAllPublicCompanies).mockResolvedValue([] as never);

    const entries = await sitemap();
    const landing = entries.filter((entry) =>
      /ky-nang|thanh-pho|cap-bac/.test(entry.url)
    );

    expect(landing.map(({ url, lastModified }) => [url, lastModified])).toEqual(
      [
        [`${SITE}/viec-lam/ky-nang/react`, "2026-11-05T00:00:00.000Z"],
        [`${SITE}/viec-lam/thanh-pho/da-nang`, "2026-11-05T00:00:00.000Z"],
        [`${SITE}/viec-lam/cap-bac/lead`, "2026-11-05T00:00:00.000Z"],
      ]
    );
  });

  it("leaves lastmod out rather than inventing one", async () => {
    jest
      .mocked(fetchAllPublicJobs)
      .mockResolvedValue([{ _id: "j1", name: "Dev One", skills: [] }] as never);
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
