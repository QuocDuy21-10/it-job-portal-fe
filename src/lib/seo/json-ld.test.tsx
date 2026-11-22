import { render } from "@testing-library/react";
import type { Company } from "@/features/company/schemas/company.schema";
import type { Job } from "@/features/job/schemas/job.schema";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
  buildCompanyJsonLd,
  buildHomeJsonLd,
  buildJobFactsDescription,
  buildJobPostingJsonLd,
  type Translate,
} from "./json-ld";

jest.mock("@/i18n/routing", () => ({
  routing: { locales: ["en", "vi"], defaultLocale: "en" },
}));

const SITE = "http://localhost:3000";

const job = {
  _id: "j1",
  name: "Senior Backend Engineer (Go)",
  skills: ["Go"],
  company: { _id: "c1", name: "VNG Corporation", logo: "vng.png" },
  locationCode: "HCM",
  location: "TP. Hồ Chí Minh",
  salary: 63_000_000,
  quantity: 1,
  formOfWork: "Full-time",
  level: "Senior",
  description: "<p>Build <strong>APIs</strong></p><script>alert(1)</script>",
  startDate: "2026-10-16T00:00:00.000Z",
  endDate: "2026-12-05T00:00:00.000Z",
  isActive: true,
  approvedAt: "2026-10-17T00:00:00.000Z",
  createdAt: "2026-10-16T00:00:00.000Z",
} as Job;

const posting = (overrides: Partial<Job> = {}) =>
  buildJobPostingJsonLd({
    job: { ...job, ...overrides },
    locale: "vi",
    logoUrl: "https://api.example.com/vng.png",
    factsDescription: "facts",
  });

describe("buildJobPostingJsonLd", () => {
  it("describes the job with its full sanitized HTML and real dates", () => {
    const data = posting();

    expect(data.description).toContain("<p>Build <strong>APIs</strong></p>");
    expect(data.description).not.toContain("<script");
    expect(data.datePosted).toBe("2026-10-17T00:00:00.000Z");
    expect(data.validThrough).toBe("2026-12-05T00:00:00.000Z");
    expect(data.url).toBe(`${SITE}/vi/jobs/j1`);
    expect(data.hiringOrganization).toEqual({
      "@type": "Organization",
      name: "VNG Corporation",
      url: `${SITE}/vi/companies/c1`,
      logo: "https://api.example.com/vng.png",
    });
  });

  it.each([
    ["Full-time", "FULL_TIME"],
    ["Part-time", "PART_TIME"],
    ["Internship", "INTERN"],
    ["Freelance", "CONTRACTOR"],
    ["Other", "OTHER"],
  ] as const)("maps %s to %s", (formOfWork, expected) => {
    expect(posting({ formOfWork })).toHaveProperty("employmentType", expected);
  });

  it("marks only Remote jobs as TELECOMMUTE and does not guess their contract", () => {
    const remote = posting({ formOfWork: "Remote" });
    const hybrid = posting({ formOfWork: "Hybrid" });

    expect(remote).toHaveProperty("jobLocationType", "TELECOMMUTE");
    expect(remote).not.toHaveProperty("employmentType");
    expect(hybrid).not.toHaveProperty("jobLocationType");
    expect(hybrid).not.toHaveProperty("employmentType");
  });

  it("declares a salary only when the job has one", () => {
    expect(posting()).toHaveProperty("baseSalary", {
      "@type": "MonetaryAmount",
      currency: "VND",
      value: {
        "@type": "QuantitativeValue",
        unitText: "MONTH",
        value: 63_000_000,
      },
    });
    expect(posting({ salary: 0 })).not.toHaveProperty("baseSalary");
  });

  it("falls back to the facts sentence when the description sanitizes to nothing", () => {
    expect(
      posting({ description: "<script>alert(1)</script>" }).description
    ).toBe("facts");
  });
});

describe("buildJobFactsDescription", () => {
  const messages: Record<string, string> = {
    jobDescription:
      "{company} tuyển {job} tại {location}: {details}. Hạn nộp {endDate}.",
    jobSalary: "lương {salary}",
    jobLevel: "cấp bậc {level}",
  };
  const t: Translate = (key, values = {}) =>
    messages[key].replace(/\{(\w+)\}/g, (_, name: string) =>
      String(values[name])
    );

  it("lists salary, level and work type", () => {
    expect(buildJobFactsDescription(job, "vi", t)).toMatch(
      /^VNG Corporation tuyển Senior Backend Engineer \(Go\) tại TP\. Hồ Chí Minh: lương .+, cấp bậc Senior, Full-time\. Hạn nộp .+\.$/
    );
  });

  it("leaves the salary out when there is none", () => {
    expect(
      buildJobFactsDescription({ ...job, salary: 0 }, "vi", t)
    ).not.toContain("lương");
  });
});

describe("buildCompanyJsonLd", () => {
  const company = {
    _id: "c1",
    name: "FPT Software",
    description: "<p>Outsourcing</p>",
    address: "Hà Nội",
    website: "https://fpt.com",
    numberOfEmployees: 0,
    logo: "",
    totalJobs: 0,
  } as Company;

  it("leaves out an employee count of 0 and a missing logo", () => {
    const data = buildCompanyJsonLd({
      company,
      locale: "en",
      logoUrl: null,
      description: "d",
    });

    expect(data).not.toHaveProperty("numberOfEmployees");
    expect(data).not.toHaveProperty("logo");
    expect(data).toHaveProperty("sameAs", ["https://fpt.com"]);
    expect(data.url).toBe(`${SITE}/companies/c1`);
  });

  it("keeps a real employee count", () => {
    expect(
      buildCompanyJsonLd({
        company: { ...company, numberOfEmployees: 500 },
        locale: "en",
        logoUrl: null,
        description: "d",
      })
    ).toHaveProperty("numberOfEmployees", {
      "@type": "QuantitativeValue",
      value: 500,
    });
  });
});

describe("buildBreadcrumbJsonLd", () => {
  it("numbers the items in order", () => {
    expect(
      buildBreadcrumbJsonLd([
        { name: "Trang chủ", url: `${SITE}/vi` },
        { name: "Tìm Việc", url: `${SITE}/vi/jobs` },
      ]).itemListElement
    ).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: "Trang chủ",
        item: `${SITE}/vi`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tìm Việc",
        item: `${SITE}/vi/jobs`,
      },
    ]);
  });
});

describe("buildHomeJsonLd", () => {
  it("names the site on the home page", () => {
    expect(buildHomeJsonLd()["@graph"][0]).toEqual({
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      name: "DevLink",
      url: `${SITE}/`,
    });
  });
});

describe("JsonLd", () => {
  it("escapes < so data cannot close the script tag", () => {
    const data = { name: "</script><script>alert(1)</script>" };
    const { container } = render(<JsonLd data={data} />);
    const script = container.querySelector(
      'script[type="application/ld+json"]'
    );

    expect(script?.innerHTML).not.toContain("</script>");
    expect(JSON.parse(script?.innerHTML ?? "")).toEqual(data);
  });
});
