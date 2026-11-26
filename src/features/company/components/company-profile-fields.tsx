"use client";

import type { UseFormReturn } from "react-hook-form";
import { MultiSelect } from "@/components/multi-select";
import { SingleSelect } from "@/components/single-select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BENEFIT_ICONS,
  COMPANY_BENEFITS,
  COMPANY_INDUSTRIES,
  MAX_BENEFIT_NOTE_LENGTH,
  MAX_TECH_STACK,
  type CompanyBenefitItem,
  type CompanyBenefitType,
} from "@/features/company/constants/company-profile";
import type { CreateCompanyFormData } from "@/features/company/schemas/company.schema";
import { BannerImageField } from "@/features/site-content/components/banner-image-field";
import { useI18n } from "@/hooks/use-i18n";
import { useSkillCatalog } from "@/hooks/use-skill-catalog";
import { API_BASE_URL_IMAGE } from "@/shared/constants/constant";

type CompanyProfileFieldsProps = {
  form: UseFormReturn<CreateCompanyFormData>;
  formId: string;
  isLoading?: boolean;
  onNewCoverUploaded?: (fileName: string) => void;
};

const coverUrl = (fileName?: string | null) =>
  fileName ? `${API_BASE_URL_IMAGE}/images/company/${fileName}` : null;

export function CompanyProfileFields({
  form,
  formId,
  isLoading,
  onNewCoverUploaded,
}: CompanyProfileFieldsProps) {
  const { t } = useI18n();
  const { skillOptions, isLoading: isLoadingSkills } = useSkillCatalog();
  const label = (key: string, values?: Record<string, number>) =>
    t(`adminPages.companies.form.${key}`, values);
  const industryOptions = COMPANY_INDUSTRIES.map((key) => ({
    value: key,
    label: t(`companyProfile.industry.${key}`),
  }));
  const benefits = form.watch("benefits") ?? [];
  const noteOf = (type: CompanyBenefitType) =>
    benefits.find((item) => item.type === type)?.note ?? null;

  // Rebuilt in the constant's order, so the page lists benefits the same way every time.
  const setBenefits = (next: Map<CompanyBenefitType, string | null>) =>
    form.setValue(
      "benefits",
      COMPANY_BENEFITS.filter((type) => next.has(type)).map(
        (type): CompanyBenefitItem => ({ type, note: next.get(type) ?? null })
      ),
      { shouldDirty: true, shouldValidate: true }
    );
  const current = () =>
    new Map<CompanyBenefitType, string | null>(
      benefits.map((item) => [item.type, item.note ?? null])
    );

  return (
    <section className="space-y-4 border-t border-border pt-6">
      <h3 className="text-h4">{label("profile")}</h3>

      <BannerImageField
        id={`${formId}-cover`}
        folder="company"
        label={label("cover")}
        hint={label("coverHint")}
        optional
        aspectClassName="aspect-[4/1]"
        previewUrl={coverUrl(form.watch("coverImage"))}
        disabled={isLoading}
        onUploaded={(fileName) => {
          onNewCoverUploaded?.(fileName);
          form.setValue("coverImage", fileName, { shouldDirty: true });
        }}
        onRemove={() =>
          form.setValue("coverImage", null, { shouldDirty: true })
        }
      />

      <FormField
        control={form.control}
        name="industry"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label("industry")}</FormLabel>
            <FormControl>
              <SingleSelect
                options={industryOptions}
                value={field.value ?? ""}
                onChange={(value) => field.onChange(value || null)}
                placeholder={label("industryPlaceholder")}
                searchPlaceholder={label("industrySearch")}
                disabled={isLoading}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="techStack"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel>{label("techStack")}</FormLabel>
              <span className="text-xs text-muted-foreground tabular-nums">
                {label("techStackCount", { count: field.value?.length ?? 0 })}
              </span>
            </div>
            <FormControl>
              <MultiSelect
                options={skillOptions}
                value={field.value ?? []}
                onChange={(values) =>
                  field.onChange(values.slice(0, MAX_TECH_STACK))
                }
                aria-label={label("techStack")}
                placeholder={label("techStackPlaceholder")}
                searchPlaceholder={label("techStackSearch")}
                emptyText={label("techStackEmpty")}
                disabled={isLoading || isLoadingSkills}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">{label("benefits")}</legend>
        <div className="grid gap-3 md:grid-cols-2">
          {COMPANY_BENEFITS.map((type) => {
            const Icon = BENEFIT_ICONS[type];
            const checked = benefits.some((item) => item.type === type);
            const checkboxId = `${formId}-benefit-${type}`;
            const noteId = `${formId}-benefit-${type}-note`;

            return (
              <div
                key={type}
                className="space-y-2 rounded-md border border-border p-3"
              >
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={checkboxId}
                    checked={checked}
                    disabled={isLoading}
                    onCheckedChange={(value) => {
                      const next = current();
                      if (value === true) next.set(type, null);
                      else next.delete(type);
                      setBenefits(next);
                    }}
                  />
                  <Icon
                    className="h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Label htmlFor={checkboxId} className="font-normal">
                    {t(`companyProfile.benefit.${type}`)}
                  </Label>
                </div>
                {checked && (
                  <div className="space-y-1">
                    <Label
                      htmlFor={noteId}
                      className="text-xs text-muted-foreground"
                    >
                      {label("benefitNote")}
                    </Label>
                    <Input
                      id={noteId}
                      value={noteOf(type) ?? ""}
                      maxLength={MAX_BENEFIT_NOTE_LENGTH}
                      placeholder={label("benefitNotePlaceholder")}
                      disabled={isLoading}
                      onChange={(event) => {
                        const next = current();
                        next.set(type, event.target.value || null);
                        setBenefits(next);
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {form.formState.errors.benefits?.message && (
          <p role="alert" className="text-sm text-destructive">
            {form.formState.errors.benefits.message}
          </p>
        )}
      </fieldset>
    </section>
  );
}
