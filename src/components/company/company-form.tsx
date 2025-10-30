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
      name: "",
      description: "",
      address: "",
      website: "",
      numberOfEmployees: 0,
    },
    mode: "onChange", // Validate khi user nhập
  });

  // Reset form khi initialData thay đổi (edit mode)
  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name || "",
        description: initialData.description || "",
        address: initialData.address || "",
        website: initialData.website || "",
        numberOfEmployees: initialData.numberOfEmployees || 0,
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
        {/* Company Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Company Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter company name"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Description <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={4}
                  placeholder="Enter company description (10-500 characters)"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Number of Employees Field */}
        <FormField
          control={form.control}
          name="numberOfEmployees"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Employee Count <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  placeholder="Enter number of employees"
                  onChange={(e) => {
                    const value = e.target.value;
                    // Convert to number, hoặc 0 nếu empty
                    field.onChange(value === "" ? 0 : Number(value));
                  }}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Website Field */}
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  {...field}
                  placeholder="https://example.com"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Address Field */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Address <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter company address"
                  disabled={isLoading}
                />
              </FormControl>
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
