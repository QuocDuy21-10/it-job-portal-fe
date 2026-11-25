import { z } from "zod";
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
  });
