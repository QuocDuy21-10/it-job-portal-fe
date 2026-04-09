import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
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
  CreateUserFormData,
  UpdateUserFormData,
  createUserFormSchema,
  updateUserFormSchema,
} from "@/features/user/schemas/user.schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetRolesQuery } from "@/features/role/redux/role.api";
import { useGetCompaniesQuery } from "@/features/company/redux/company.api";
import { Combobox } from "@/components/combo-box";
import { ROLES } from "@/shared/constants/roles";

type UserFormValues = CreateUserFormData | UpdateUserFormData;

type UserFormInitialData = {
  name?: string;
  email?: string;
  password?: string;
  role?: string | { _id?: string; name?: string } | null;
  company?: {
    _id?: string;
    name?: string;
    logo?: string | null;
  } | null;
};

const normalizeRoleValue = (role: UserFormInitialData["role"]) => {
  if (typeof role === "string") {
    return role;
  }

  return role?._id || "";
};

const normalizeCompanyValue = (company?: UserFormInitialData["company"]) => {
  if (!company?._id) {
    return undefined;
  }

  return {
    _id: company._id,
    name: company.name,
    logo: company.logo ?? undefined,
  };
};

const normalizeInitialValues = (initialData?: UserFormInitialData) => ({
  name: initialData?.name || "",
  email: initialData?.email || "",
  password: "",
  role: normalizeRoleValue(initialData?.role),
  company: normalizeCompanyValue(initialData?.company),
});

interface UserFormProps {
  initialData?: UserFormInitialData;
  onSubmit: (data: UserFormValues) => Promise<boolean>;
  isLoading?: boolean;
}

export function UserForm({ initialData, onSubmit, isLoading }: UserFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isEditMode = !!initialData;

  const { data: rolesData } = useGetRolesQuery({
    page: 1,
    limit: 100,
  });

  const roles = (rolesData?.data?.result || []) as Array<{
    _id: string;
    name: string;
  }>;
  const hrRoleId = useMemo(
    () => roles.find((role: { name: string }) => role.name === ROLES.HR)?._id,
    [roles]
  );

  const { data: companiesData } = useGetCompaniesQuery({
    page: 1,
    limit: 100,
  });

  const companies = companiesData?.data?.result || [];
  const companyOptions = companies.map((company: any) => ({
    label: company.name,
    value: company._id,
    logo: company.logo,
  }));

  const normalizedInitialValues = useMemo(
    () => normalizeInitialValues(initialData),
    [initialData]
  );

  const schema = useMemo(
    () =>
      isEditMode
        ? updateUserFormSchema(hrRoleId)
        : createUserFormSchema(hrRoleId),
    [hrRoleId, isEditMode]
  );

  const form = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: normalizedInitialValues,
    mode: "onChange",
  });

  const selectedRoleId = form.watch("role");
  const isHrRoleSelected = !!hrRoleId && selectedRoleId === hrRoleId;

  const handleCompanyChange = (companyId: string) => {
    const selectedCompany = companies.find(
      (company: { _id: string }) => company._id === companyId
    );

    if (selectedCompany) {
      form.setValue(
        "company",
        {
          _id: selectedCompany._id,
          name: selectedCompany.name,
          logo: selectedCompany.logo ?? undefined,
        },
        {
          shouldDirty: true,
          shouldValidate: true,
        }
      );
      return;
    }

    form.setValue("company", undefined, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  useEffect(() => {
    form.reset(normalizedInitialValues);
  }, [form, normalizedInitialValues]);

  useEffect(() => {
    if (!hrRoleId || selectedRoleId === hrRoleId) {
      return;
    }

    if (!form.getValues("company")) {
      return;
    }

    form.setValue("company", undefined, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [form, hrRoleId, selectedRoleId]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  User Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g. John Doe"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="example@email.com"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {!isEditMode && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Password <span className="text-red-500">*</span>
                </FormLabel>
                <div className="relative">
                  <input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    disabled={isLoading}
                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Role <span className="text-red-500">*</span>
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role: any) => (
                    <SelectItem key={role._id} value={role._id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {isHrRoleSelected && (
          <FormField
            control={form.control}
            name="company._id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Công ty <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Combobox
                    options={companyOptions}
                    value={field.value}
                    onChange={handleCompanyChange}
                    placeholder="Chọn công ty"
                    searchPlaceholder="Tìm kiếm công ty..."
                    emptyText="Không tìm thấy công ty"
                    disabled={isLoading || companies.length === 0}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? "Saving..."
              : initialData
                ? "Update User"
                : "Create User"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
