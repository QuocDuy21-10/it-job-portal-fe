"use client";

import { useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  AdminDrawer,
  AdminDrawerFormFooter,
} from "@/components/admin/admin-drawer";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFocusFirstError } from "@/hooks/use-focus-first-error";
import { useI18n } from "@/hooks/use-i18n";
import { useCreateJobSourceMutation } from "../redux/crawl.api";
import {
  createJobSourceSchema,
  type CreateJobSourceInput,
} from "../schemas/crawl.schema";

type AddSourceDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddSourceDrawer({ open, onOpenChange }: AddSourceDrawerProps) {
  const { t } = useI18n();
  const formId = useId();
  const [createSource, { isLoading }] = useCreateJobSourceMutation();
  const form = useForm<CreateJobSourceInput>({
    resolver: zodResolver(createJobSourceSchema(t)),
    defaultValues: { provider: "GREENHOUSE", boardToken: "", companyName: "" },
    mode: "onTouched",
    shouldFocusError: false,
  });
  const { isDirty, submitCount } = form.formState;
  useFocusFirstError(submitCount, formId);

  const label = (key: string) => t(`adminPages.crawl.addDialog.${key}`);

  const close = (nextOpen: boolean) => {
    // This form lives above the drawer, so it does not unmount on close.
    if (!nextOpen) form.reset();
    onOpenChange(nextOpen);
  };

  const submit = async (input: CreateJobSourceInput) => {
    try {
      await createSource(input).unwrap();
      toast.success(t("adminPages.crawl.sources.syncQueued"));
      close(false);
    } catch (error: any) {
      toast.error(error?.data?.message || t("adminPages.crawl.error"));
    }
  };

  return (
    <AdminDrawer
      open={open}
      onOpenChange={close}
      title={label("title")}
      description={label("description")}
      isDirty={isDirty}
      isBusy={isLoading}
      footer={
        <AdminDrawerFormFooter formId={formId} submitLabel={label("submit")} />
      }
    >
      <Form {...form}>
        <form
          id={formId}
          noValidate
          onSubmit={form.handleSubmit(submit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="provider"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label("provider")}</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={label("providerPlaceholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="GREENHOUSE">Greenhouse</SelectItem>
                    <SelectItem value="LEVER">Lever</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="boardToken"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label("boardToken")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    maxLength={100}
                    placeholder={label("boardTokenPlaceholder")}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>{label("boardTokenHint")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label("companyName")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    maxLength={200}
                    placeholder={label("companyNamePlaceholder")}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </AdminDrawer>
  );
}
