import type { CompanyIndustry } from "@/features/company/constants/company-profile";
import type {
  Company,
  TopHiringCompany,
} from "@/features/company/schemas/company.schema";

// One shape for the top-hiring list (home, featured strip) and GET /companies (company list).
export type CompanyCardData = {
  id: string;
  name: string;
  logo: string | null;
  coverImage: string | null;
  address: string | null;
  industry: CompanyIndustry | null;
  techStack: string[];
  openJobs: number;
};

export const topHiringToCardData = (
  company: TopHiringCompany
): CompanyCardData => ({
  id: company._id,
  name: company.name,
  logo: company.logo || null,
  coverImage: company.coverImage || null,
  address: company.address || null,
  industry: company.industry ?? null,
  techStack: [],
  openJobs: company.totalOpenJobs,
});

export const companyToCardData = (company: Company): CompanyCardData => ({
  id: company._id,
  name: company.name,
  logo: company.logo || null,
  coverImage: company.coverImage || null,
  address: company.address || null,
  industry: company.industry ?? null,
  techStack: company.techStack ?? [],
  openJobs: company.totalJobs ?? 0,
});
