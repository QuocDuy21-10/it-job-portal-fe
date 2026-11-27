import { externalJobHref, jobHref } from "@/i18n/hrefs";
import type { Job } from "@/features/job/schemas/job.schema";
import type { JobSearchItem } from "@/features/job/schemas/job-search.schema";
import { jobToCardData, searchItemToCardData } from "./job-card-data";

const job = {
  _id: "job-1",
  name: "Frontend Engineer",
  company: { _id: "c1", name: "Acme", logo: "acme.png" },
  location: "Hà Nội",
  salary: 25000000,
  level: "Senior",
  formOfWork: "Full-time",
  skills: ["React"],
  createdAt: "2026-11-20T00:00:00.000Z",
  endDate: "2026-12-20T00:00:00.000Z",
  isActive: true,
} as unknown as Job;

const item: JobSearchItem = {
  id: "x1",
  sourceType: "EXTERNAL",
  title: "Go Developer",
  companyName: "Crawled Co",
  location: "Remote",
  salaryText: "Up to $3000",
  isRemote: true,
  skills: ["Go"],
  postedAt: "2026-11-25T00:00:00.000Z",
  applyMode: "EXTERNAL_REDIRECT",
};

describe("jobToCardData", () => {
  it("maps an internal job", () => {
    expect(jobToCardData(job)).toEqual({
      id: "job-1",
      href: jobHref("job-1", "Frontend Engineer"),
      title: "Frontend Engineer",
      companyName: "Acme",
      companyLogo: "acme.png",
      location: "Hà Nội",
      salary: 25000000,
      salaryText: null,
      level: "Senior",
      workType: "Full-time",
      skills: ["React"],
      postedAt: "2026-11-20T00:00:00.000Z",
      endDate: "2026-12-20T00:00:00.000Z",
      isActive: true,
      isExternal: false,
    });
  });

  it("treats a zero salary as not disclosed instead of 0 ₫", () => {
    expect(jobToCardData({ ...job, salary: 0 } as Job).salary).toBeNull();
  });
});

describe("searchItemToCardData", () => {
  it("maps a crawled job to its external page and keeps its salary text", () => {
    const data = searchItemToCardData(item);

    expect(data.isExternal).toBe(true);
    expect(data.href).toEqual(externalJobHref("x1"));
    expect(data.salary).toBeNull();
    expect(data.salaryText).toBe("Up to $3000");
    expect(data.workType).toBe("Remote");
    expect(data.isActive).toBe(true);
  });

  it("maps an internal search hit to the job page", () => {
    const data = searchItemToCardData({
      ...item,
      sourceType: "INTERNAL",
      salary: 30000000,
      formOfWork: "Hybrid",
    });

    expect(data.isExternal).toBe(false);
    expect(data.href).toEqual(jobHref("x1", "Go Developer"));
    expect(data.salary).toBe(30000000);
    expect(data.workType).toBe("Hybrid");
  });
});
