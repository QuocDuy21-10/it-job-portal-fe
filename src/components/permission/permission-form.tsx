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
  PermissionSchema,
  CreatePermissionFormData,
} from "@/features/permission/schemas/permission.schema";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface PermissionFormProps {
  initialData?: Partial<CreatePermissionFormData>;
  onSubmit: (data: CreatePermissionFormData) => Promise<boolean>;
  isLoading?: boolean;
}

export function PermissionForm({
  initialData,
  onSubmit,
  isLoading,
}: PermissionFormProps) {
  const form = useForm<CreatePermissionFormData>({
    resolver: zodResolver(PermissionSchema),
    defaultValues: {
      name: initialData?.name || "",
      apiPath: initialData?.apiPath || "",
      method: initialData?.method || "GET",
      module: initialData?.module || "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Permission Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g. Create User"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="apiPath"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                API Path <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g. /api/v1/users"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                HTTP Method <span className="text-red-500">*</span>
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select HTTP method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="module"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Module <span className="text-red-500">*</span>
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Module" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USERS">USER</SelectItem>
                  <SelectItem value="ROLES">ROLE</SelectItem>
                  <SelectItem value="STATISTICS">STATISTIC</SelectItem>
                  <SelectItem value="PERMISSIONS">PERMISSION</SelectItem>
                  <SelectItem value="COMPANIES">COMPANY</SelectItem>
                  <SelectItem value="JOBS">JOB</SelectItem>
                  <SelectItem value="RESUMES">RESUME</SelectItem>
                  <SelectItem value="FILES">FILE</SelectItem>
                  <SelectItem value="SUBSCRIBERS">SUBSCRIBER</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isLoading || !form.formState.isValid}>
            {isLoading
              ? "Saving..."
              : initialData
              ? "Update Permission"
              : "Create Permission"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
