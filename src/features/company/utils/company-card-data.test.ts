import type {
  Company,
  TopHiringCompany,
} from "@/features/company/schemas/company.schema";
import { companyToCardData, topHiringToCardData } from "./company-card-data";

describe("company card data", () => {
  it("maps a top-hiring company with its open jobs", () => {
    const company = {
      _id: "c1",
      name: "Acme",
      logo: null,
      address: "Hà Nội",
      industry: "TELECOM",
      coverImage: "cover.webp",
      totalOpenJobs: 7,
    } as TopHiringCompany;

    expect(topHiringToCardData(company)).toEqual({
      id: "c1",
      name: "Acme",
      logo: null,
      coverImage: "cover.webp",
      address: "Hà Nội",
      industry: "TELECOM",
      techStack: [],
      openJobs: 7,
    });
  });

  it("maps a listed company, turning an empty logo into null", () => {
    const company = {
      _id: "c2",
      name: "Beta",
      logo: "",
      address: "",
      industry: null,
      coverImage: null,
      techStack: ["Go", "React"],
      totalJobs: 0,
    } as unknown as Company;

    expect(companyToCardData(company)).toEqual({
      id: "c2",
      name: "Beta",
      logo: null,
      coverImage: null,
      address: null,
      industry: null,
      techStack: ["Go", "React"],
      openJobs: 0,
    });
  });
});
