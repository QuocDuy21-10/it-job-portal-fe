import { z } from "zod";
import type { Translate } from "@/shared/types/i18n";

const identity: Translate = (key) => key;
const ERROR = "adminPages.companies.form.errors";

export const createCompanySchema = (t: Translate = identity) =>
  z.object({
    name: z
      .string()
      .min(1, t(`${ERROR}.name`))
      .max(100, t(`${ERROR}.name`)),
    description: z
      .string()
      .min(10, t(`${ERROR}.description`))
      .max(3000, t(`${ERROR}.description`)),
    address: z
      .string()
      .min(1, t(`${ERROR}.address`))
      .max(200, t(`${ERROR}.address`)),
    website: z
      .string()
      .url(t(`${ERROR}.website`))
      .or(z.literal("")),
    numberOfEmployees: z
      .number(t(`${ERROR}.employees`))
      .min(0, t(`${ERROR}.employees`))
      .max(1000000, t(`${ERROR}.employees`)),
    logo: z.string().optional(),
  });

export const CompanySchema = createCompanySchema();

export const CompanyEntitySchema = CompanySchema.extend({
  _id: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  totalJobs: z.number().default(0),
  createdBy: z
    .object({
      _id: z.string(),
      email: z.string(),
    })
    .optional(),
  updatedBy: z
    .object({
      _id: z.string(),
      email: z.string(),
    })
    .optional(),
});

// Types
export type Company = z.infer<typeof CompanyEntitySchema>;
export type CreateCompanyFormData = z.infer<typeof CompanySchema>;
export type UpdateCompanyFormData = Partial<CreateCompanyFormData>;

export interface TopHiringCompany {
  _id: string;
  name: string;
  logo?: string | null;
  address: string;
  website?: string | null;
  numberOfEmployees?: number;
  totalOpenJobs: number;
}
