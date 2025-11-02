import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
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
  ResumeSchema,
  CreateResumeFormData,
} from "@/features/resume/schemas/resume.schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ResumeFormProps {
  initialData?: Partial<CreateResumeFormData>;
  onSubmit: (data: CreateResumeFormData) => Promise<boolean>;
  isLoading?: boolean;
}

export function ResumeForm({
  initialData,
  onSubmit,
  isLoading,
}: ResumeFormProps) {
  const form = useForm<CreateResumeFormData>({
    resolver: zodResolver(ResumeSchema),
    defaultValues: {
      email: initialData?.email || "",
      userId: initialData?.userId || "",
      url: initialData?.url || "",
      status: initialData?.status || "PENDING",
      companyId: initialData?.companyId || undefined,
      jobId: initialData?.jobId || undefined,
      histories: initialData?.histories || [],
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        email: initialData.email || "",
        userId: initialData.userId || "",
        url: initialData.url || "",
        status: initialData.status || "PENDING",
        companyId: initialData.companyId,
        jobId: initialData.jobId,
        histories: initialData.histories || [],
      });
    }
  }, [initialData, form]);

  const handleLocalSubmit = async (values: CreateResumeFormData) => {
    const payload: CreateResumeFormData = {
      email: form.getValues("email"),
      userId: form.getValues("userId"),
      url: form.getValues("url"),
      status: values.status,
      companyId: form.getValues("companyId"),
      jobId: form.getValues("jobId"),
      histories: form.getValues("histories") || [],
    };

    return await onSubmit(payload);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleLocalSubmit)}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Read-only fields */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User ID</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CV URL</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jobId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job ID</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="companyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company ID</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Editable: status only */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="REVIEWING">Reviewing</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isLoading || !form.formState.isValid}>
            {isLoading ? "Saving..." : "Update Status"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
