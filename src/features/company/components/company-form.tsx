"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogoUpload } from "@/components/logo-upload";
import { RichTextEditor } from "@/components/rich-text-editor";
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
  createCompanySchema,
  type CreateCompanyFormData,
} from "@/features/company/schemas/company.schema";
import { useFocusFirstError } from "@/hooks/use-focus-first-error";
import { useI18n } from "@/hooks/use-i18n";

interface CompanyFormProps {
  formId: string;
  initialData?: Partial<CreateCompanyFormData>;
  onSubmit: (data: CreateCompanyFormData) => Promise<boolean>;
  isLoading?: boolean;
  onDirtyChange?: (isDirty: boolean) => void;
  onNewLogoUploaded?: (prev: string | null, next: string | null) => void;
}

export function CompanyForm({
  formId,
  initialData,
  onSubmit,
  isLoading,
  onDirtyChange,
  onNewLogoUploaded,
}: CompanyFormProps) {
  const { t } = useI18n();
  const form = useForm<CreateCompanyFormData>({
    resolver: zodResolver(createCompanySchema(t)),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      address: initialData?.address ?? "",
      website: initialData?.website ?? "",
      numberOfEmployees: initialData?.numberOfEmployees,
      logo: initialData?.logo ?? "",
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

  const label = (key: string) => t(`adminPages.companies.form.${key}`);

  return (
    <Form {...form}>
      <form
        id={formId}
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <section className="space-y-4">
          <h3 className="text-h4">
            {label("logo")}{" "}
            <span className="text-body-sm font-normal text-muted-foreground">
              {t("adminPages.drawer.optional")}
            </span>
          </h3>
          <LogoUpload
            value={form.watch("logo")}
            onChange={(fileName) =>
              form.setValue("logo", fileName, { shouldDirty: true })
            }
            disabled={isLoading}
            originalValue={initialData?.logo}
            onNewFileUploaded={onNewLogoUploaded}
          />
        </section>

        <section className="space-y-4 border-t border-border pt-6">
          <h3 className="text-h4">{label("info")}</h3>
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
              name="numberOfEmployees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label("employees")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      inputMode="numeric"
                      min={0}
                      className="tabular-nums"
                      value={field.value ?? ""}
                      onChange={(event) =>
                        field.onChange(
                          event.target.value === ""
                            ? undefined
                            : Number(event.target.value)
                        )
                      }
                      placeholder={label("employeesPlaceholder")}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {label("website")}{" "}
                    <span className="font-normal text-muted-foreground">
                      {t("adminPages.drawer.optional")}
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="url"
                      placeholder={label("websitePlaceholder")}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label("address")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={label("addressPlaceholder")}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <section className="space-y-4 border-t border-border pt-6">
          <h3 className="text-h4">{label("description")}</h3>
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
        </section>
      </form>
    </Form>
  );
}
