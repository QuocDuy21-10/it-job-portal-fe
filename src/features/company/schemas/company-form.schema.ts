import { z } from "zod";
import {
  COMPANY_BENEFITS,
  COMPANY_INDUSTRIES,
  MAX_BENEFIT_NOTE_LENGTH,
  MAX_BENEFITS,
  MAX_TECH_STACK,
} from "@/features/company/constants/company-profile";
import type { Translate } from "@/shared/types/i18n";

// Kept apart from company.schema.ts: that file is reachable from public routes,
// which must not reference admin-only translation keys.
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
    coverImage: z.string().nullable().optional(),
    industry: z.enum(COMPANY_INDUSTRIES).nullable().optional(),
    techStack: z
      .array(z.string())
      .max(MAX_TECH_STACK, t(`${ERROR}.techStack`))
      .optional(),
    benefits: z
      .array(
        z.object({
          type: z.enum(COMPANY_BENEFITS),
          note: z
            .string()
            .max(MAX_BENEFIT_NOTE_LENGTH, t(`${ERROR}.benefitNote`))
            .nullable()
            .optional(),
        })
      )
      .max(MAX_BENEFITS, t(`${ERROR}.benefits`))
      .refine(
        (items) =>
          new Set(items.map((item) => item.type)).size === items.length,
        t(`${ERROR}.benefits`)
      )
      .optional(),
  });
