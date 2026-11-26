"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  AdminDrawer,
  AdminDrawerFormFooter,
} from "@/components/admin/admin-drawer";
import { DatePicker } from "@/components/date-picker";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFileOperations } from "@/hooks/use-file";
import { useFocusFirstError } from "@/hooks/use-focus-first-error";
import { useI18n } from "@/hooks/use-i18n";
import {
  BANNER_FOLDER,
  bannerFormSchema,
  bannerImageUrl,
  toBannerBody,
  toBannerFormValues,
  type BannerFormValues,
} from "../lib/banner-form";
import {
  useCreateBannerMutation,
  useUpdateBannerMutation,
} from "../redux/site-content.api";
import type { Banner } from "../schemas/site-content.schema";
import { BannerImageField } from "./banner-image-field";

type BannerDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner: Banner | null;
};

const LOCALES = ["vi", "en"] as const;
const TEXT_FIELDS = [
  { name: "title", label: "title" },
  { name: "description", label: "descriptionField" },
  { name: "ctaLabel", label: "ctaLabel" },
  { name: "ctaUrl", label: "ctaUrl", hint: "ctaUrlHint" },
] as const;

export function BannerDrawer({
  open,
  onOpenChange,
  banner,
}: BannerDrawerProps) {
  const { t } = useI18n();
  const formId = useId();
  const text = (key: string) => t(`adminPages.siteContent.banner.form.${key}`);
  const { handleDelete } = useFileOperations();
  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
  const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();
  const [tab, setTab] = useState<(typeof LOCALES)[number]>("vi");
  // Files uploaded while this drawer is open; the saved slide keeps only the ones it uses.
  const uploads = useRef<string[]>([]);

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerFormSchema(t)),
    defaultValues: toBannerFormValues(banner),
    mode: "onTouched",
    shouldFocusError: false,
  });
  const { isDirty, submitCount, errors } = form.formState;
  useFocusFirstError(submitCount, formId);

  useEffect(() => {
    if (!open) return;
    form.reset(toBannerFormValues(banner));
    uploads.current = [];
    setTab("vi");
  }, [open, banner, form]);

  const discardUploads = (keep: Array<string | null> = []) => {
    uploads.current
      .filter((name) => !keep.includes(name))
      .forEach((name) => handleDelete(name, BANNER_FOLDER));
    uploads.current = [];
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) discardUploads();
    onOpenChange(next);
  };

  const preview = (
    fileName: string,
    storedName?: string | null,
    storedUrl?: string | null
  ) => {
    if (!fileName) return null;
    return fileName === storedName && storedUrl
      ? storedUrl
      : bannerImageUrl(fileName);
  };

  const submit = async (values: BannerFormValues) => {
    const body = toBannerBody(values);
    try {
      if (banner) {
        await updateBanner({ id: banner._id, data: body }).unwrap();
      } else {
        await createBanner(body).unwrap();
      }
      toast.success(t("adminPages.siteContent.saved"));
      discardUploads([body.fileName, body.mobileFileName]);
      onOpenChange(false);
    } catch (error: any) {
      // Uploads stay so a retry can use them; closing the drawer deletes them.
      toast.error(error?.data?.message || t("adminPages.siteContent.error"));
    }
  };

  const showInvalidTab = (invalid: typeof errors) => {
    if (invalid.content?.vi) setTab("vi");
    else if (invalid.content?.en) setTab("en");
  };

  const uploaded =
    (field: "fileName" | "mobileFileName") => (fileName: string) => {
      uploads.current.push(fileName);
      form.setValue(field, fileName, {
        shouldDirty: true,
        shouldValidate: true,
      });
    };

  const hasContent = form.watch("hasContent");

  return (
    <AdminDrawer
      open={open}
      onOpenChange={handleOpenChange}
      size="lg"
      title={text(banner ? "editTitle" : "createTitle")}
      description={banner?.name ?? text("description")}
      isDirty={isDirty}
      isBusy={isCreating || isUpdating}
      footer={
        <AdminDrawerFormFooter formId={formId} submitLabel={text("save")} />
      }
    >
      <Form {...form}>
        <form
          id={formId}
          noValidate
          onSubmit={form.handleSubmit(submit, showInvalidTab)}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{text("name")}</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={100} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <section className="space-y-4 border-t border-border pt-6">
            <BannerImageField
              id={`${formId}-desktop`}
              label={text("desktopImage")}
              hint={text("desktopHint")}
              aspectClassName="aspect-[12/5]"
              previewUrl={preview(
                form.watch("fileName"),
                banner?.fileName,
                banner?.imageUrl
              )}
              error={errors.fileName?.message}
              onUploaded={uploaded("fileName")}
            />
            <BannerImageField
              id={`${formId}-mobile`}
              label={text("mobileImage")}
              hint={text("mobileHint")}
              optional
              aspectClassName="aspect-[4/5] max-w-[240px]"
              previewUrl={preview(
                form.watch("mobileFileName"),
                banner?.mobileFileName,
                banner?.mobileImageUrl
              )}
              onUploaded={uploaded("mobileFileName")}
              onRemove={() =>
                form.setValue("mobileFileName", "", { shouldDirty: true })
              }
            />
          </section>

          <section className="space-y-4 border-t border-border pt-6">
            <FormField
              control={form.control}
              name="hasContent"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    {text("hasContent")}
                  </FormLabel>
                </FormItem>
              )}
            />

            {hasContent && (
              <Tabs
                value={tab}
                onValueChange={(value) => setTab(value as typeof tab)}
              >
                <TabsList>
                  {LOCALES.map((locale) => (
                    <TabsTrigger key={locale} value={locale} className="gap-2">
                      {locale.toUpperCase()}
                      {errors.content?.[locale] && (
                        <span
                          role="img"
                          aria-label={text("tabHasErrors")}
                          className="h-2 w-2 rounded-full bg-destructive"
                        />
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {LOCALES.map((locale) => (
                  <TabsContent
                    key={locale}
                    value={locale}
                    className="space-y-4 pt-2"
                  >
                    {TEXT_FIELDS.map((item) => (
                      <FormField
                        key={item.name}
                        control={form.control}
                        name={`content.${locale}.${item.name}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{text(item.label)}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            {"hint" in item && (
                              <FormDescription>
                                {text(item.hint)}
                              </FormDescription>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </section>

          <section className="space-y-4 border-t border-border pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {(["startDay", "endDay"] as const).map((name) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{text(name)}</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={text("pickDay")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {text("scheduleHint")}
            </p>
          </section>
        </form>
      </Form>
    </AdminDrawer>
  );
}
