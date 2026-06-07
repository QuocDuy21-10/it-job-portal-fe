import { z } from "zod";

export const SkillCatalogItemSchema = z.object({
  label: z.string(),
  slug: z.string(),
  aliases: z.array(z.string()).optional(),
  category: z.string().optional(),
  description: z.string().optional(),
});

export type SkillCatalogItem = z.infer<typeof SkillCatalogItemSchema>;

export interface GetSkillCatalogParams {
  search?: string;
  limit?: number;
}
