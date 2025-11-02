import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  CompanySchema,
  CreateCompanyFormData,
} from "@/features/company/schemas/company.schema";
import { useEffect } from "react";
import { RichTextEditor } from "../rich-text-editor";
import { LogoUpload } from "../logo-upload";

interface CompanyFormProps {
  initialData?: Partial<CreateCompanyFormData>;
  onSubmit: (data: CreateCompanyFormData) => Promise<boolean>;
  isLoading?: boolean;
}

export function CompanyForm({
  initialData,
  onSubmit,
  isLoading,
}: CompanyFormProps) {
  // Khởi tạo form với React Hook Form + Zod resolver
  const form = useForm<CreateCompanyFormData>({
    resolver: zodResolver(CompanySchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      address: initialData?.address || "",
      website: initialData?.website || "",
      numberOfEmployees: initialData?.numberOfEmployees || 0,
      logo: initialData?.logo || "",
    },
    mode: "onChange", // Validate khi user nhập
  });

  // Load initial data including role
  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
      });
    }
  }, [initialData, form]);

  // Handle submit - chỉ được gọi khi validation pass
  const handleFormSubmit = async (data: CreateCompanyFormData) => {
    // React Hook Form đã validate xong mới chạy vào đây
    const success = await onSubmit(data);

    // Reset form nếu thành công và đang ở create mode
    if (success && !initialData) {
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        {/* Company Logo */}
        <div className="rounded-lg border border-input bg-card p-4">
          <div className="mb-3 block text-base font-semibold">Company Logo</div>
          <LogoUpload
            value={form.watch("logo")}
            onChange={(fileName) => form.setValue("logo", fileName)}
            disabled={isLoading}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:gap-6">
          {/* Company Name - spans 2 columns */}
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name *</FormLabel>
                  <input
                    {...field}
                    type="text"
                    placeholder="Enter company name"
                    disabled={isLoading}
                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive md:text-sm"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Employee Count - 1 column */}
          <FormField
            control={form.control}
            name="numberOfEmployees"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employees *</FormLabel>
                <input
                  {...field}
                  type="number"
                  placeholder="0"
                  disabled={isLoading}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive md:text-sm"
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Website and Address - 2 columns */}
        <div className="grid gap-4 md:grid-cols-2 lg:gap-6">
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <input
                  {...field}
                  type="url"
                  placeholder="https://example.com"
                  disabled={isLoading}
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive md:text-sm"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address *</FormLabel>
                <input
                  {...field}
                  type="text"
                  placeholder="Enter company address"
                  disabled={isLoading}
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive md:text-sm"
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description - Full width */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description *</FormLabel>
              <RichTextEditor
                value={field.value}
                onChange={field.onChange}
                placeholder="Enter company description"
                disabled={isLoading}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex justify-end gap-2">
          <Button
            type="submit"
            disabled={isLoading || form.formState.isSubmitting}
          >
            {isLoading || form.formState.isSubmitting
              ? "Saving..."
              : initialData
              ? "Update Company"
              : "Create Company"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
