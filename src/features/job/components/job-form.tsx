"use client";

import { useEffect, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Combobox } from "@/components/combo-box";
import { DatePicker } from "@/components/date-picker";
import { MultiSelect } from "@/components/multi-select";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCompanyOptions } from "@/features/company/hooks/use-company-options";
import {
  createJobSchema,
  type CreateJobFormData,
} from "@/features/job/schemas/job.schema";
import { useFocusFirstError } from "@/hooks/use-focus-first-error";
import { useI18n } from "@/hooks/use-i18n";
import { useSkillCatalog } from "@/hooks/use-skill-catalog";
import { toDateOnly } from "@/lib/utils/locale-formatters";
import jobLevels from "@/shared/data/job-level.json";
import jobTypes from "@/shared/data/job-type.json";
import { LOCATION_OPTIONS } from "@/shared/data/location-catalog";

// The data files also feed search filters, which need an "all" entry.
const LEVELS = jobLevels.filter(({ value }) => value !== "all");
const WORK_TYPES = jobTypes.filter(({ value }) => value !== "all");

const toNumber = (value: string) => (value === "" ? undefined : Number(value));

interface JobFormProps {
  formId: string;
  initialData?: Partial<CreateJobFormData>;
  onSubmit: (data: CreateJobFormData) => Promise<boolean>;
  isLoading?: boolean;
  onDirtyChange?: (isDirty: boolean) => void;
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4 border-t border-border pt-6 first:border-t-0 first:pt-0">
      <h3 className="text-h4">{title}</h3>
      {children}
    </section>
  );
}

export function JobForm({
  formId,
  initialData,
  onSubmit,
  isLoading,
  onDirtyChange,
}: JobFormProps) {
  const { t } = useI18n();
  const { skillOptions, isLoading: isLoadingSkills } = useSkillCatalog();
  const { companies, options } = useCompanyOptions(initialData?.company);

  const form = useForm<CreateJobFormData>({
    resolver: zodResolver(createJobSchema(t)),
    defaultValues: {
      name: initialData?.name ?? "",
      skills: initialData?.skills ?? [],
      company: initialData?.company ?? { _id: "", name: "", logo: null },
      locationCode: initialData?.locationCode ?? "",
      salary: initialData?.salary,
      quantity: initialData?.quantity,
      level: initialData?.level,
      formOfWork: initialData?.formOfWork,
      description: initialData?.description ?? "",
      startDate: initialData?.startDate ?? "",
      endDate: initialData?.endDate ?? "",
      isActive: initialData?.isActive ?? true,
    },
    mode: "onTouched",
    shouldFocusError: false,
  });
  const { isDirty, submitCount } = form.formState;
  useFocusFirstError(submitCount, formId);

  useEffect(() => {
    onDirtyChange?.(isDirty);
    return () => onDirtyChange?.(false);
  }, [isDirty, onDirtyChange]);

  const handleCompanyChange = (companyId: string) => {
    const selected = companies.find((company) => company._id === companyId);
    if (!selected) return;
    form.setValue(
      "company",
      {
        _id: selected._id,
        name: selected.name,
        logo: selected.logo ?? null,
      },
      { shouldDirty: true, shouldValidate: true }
    );
  };

  const label = (key: string) => t(`adminPages.jobs.form.${key}`);

  return (
    <Form {...form}>
      <form
        id={formId}
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <Group title={label("basics")}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label("name")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={label("namePlaceholder")}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="company._id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("adminPages.companyPicker.label")}</FormLabel>
                  <FormControl>
                    <Combobox
                      options={options}
                      value={field.value}
                      onChange={handleCompanyChange}
                      placeholder={t("adminPages.companyPicker.placeholder")}
                      searchPlaceholder={t("adminPages.companyPicker.search")}
                      emptyText={t("adminPages.companyPicker.empty")}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="locationCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label("location")}</FormLabel>
                  <FormControl>
                    <Combobox
                      options={LOCATION_OPTIONS}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={label("locationPlaceholder")}
                      searchPlaceholder={label("locationSearch")}
                      emptyText={label("locationEmpty")}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label("level")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={label("levelPlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {LEVELS.map(({ value }) => (
                        <SelectItem key={value} value={value}>
                          {t(`adminPages.jobs.levels.${value.toLowerCase()}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="formOfWork"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label("workType")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={label("workTypePlaceholder")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {WORK_TYPES.map(({ value }) => (
                        <SelectItem key={value} value={value}>
                          {t(`adminPages.jobs.workTypes.${value}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Group>

        <Group title={label("hiring")}>
          <div className="grid gap-4 md:grid-cols-2">
            {(["salary", "quantity"] as const).map((name) => (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label(name)}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        inputMode="numeric"
                        min={name === "salary" ? 0 : 1}
                        className="tabular-nums"
                        value={field.value ?? ""}
                        onChange={(event) =>
                          field.onChange(toNumber(event.target.value))
                        }
                        placeholder={label(`${name}Placeholder`)}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            {(["startDate", "endDate"] as const).map((name) => (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label(name)}</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={(date) => field.onChange(toDateOnly(date))}
                        placeholder={label("datePlaceholder")}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label("skills")}</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={skillOptions}
                    value={field.value}
                    onChange={field.onChange}
                    aria-label={label("skills")}
                    placeholder={label("skillsPlaceholder")}
                    searchPlaceholder={label("skillsSearch")}
                    emptyText={label("skillsEmpty")}
                    disabled={isLoading || isLoadingSkills}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Group>

        <Group title={label("description")}>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RichTextEditor
                    value={field.value}
                    onChange={(value, _delta, source) => {
                      // Quill also fires on load when it normalizes the HTML.
                      if (source === "user") field.onChange(value);
                    }}
                    aria-label={label("description")}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Group>

        <Group title={label("visibility")}>
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                    disabled={isLoading}
                  />
                </FormControl>
                <FormLabel className="cursor-pointer py-3">
                  {label("isActive")}
                </FormLabel>
              </FormItem>
            )}
          />
        </Group>
      </form>
    </Form>
  );
}
