import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  CreateUserFormData,
  UpdateUserFormData,
} from "@/features/user/schemas/user.schema";
import {
  createUserFormSchema,
  updateUserFormSchema,
} from "@/features/user/schemas/user-form.schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCompanyOptions } from "@/features/company/hooks/use-company-options";
import { Combobox } from "@/components/combo-box";
import { useFocusFirstError } from "@/hooks/use-focus-first-error";
import { useI18n } from "@/hooks/use-i18n";
import {
  ROLES,
  ROLE_VALUES,
  type RoleName,
} from "@/shared/constants/role-values";

type UserFormValues = CreateUserFormData | UpdateUserFormData;

type UserFormInitialData = {
  name?: string;
  email?: string;
  password?: string;
  role?: RoleName | { _id?: string; name?: string } | null;
  company?: {
    _id?: string;
    name?: string;
    logo?: string | null;
  } | null;
};

const isRoleName = (role?: string): role is RoleName => {
  return ROLE_VALUES.includes(role as RoleName);
};

const normalizeRoleValue = (
  role: UserFormInitialData["role"]
): RoleName | undefined => {
  const name = typeof role === "string" ? role : role?.name;
  return isRoleName(name) ? name : undefined;
};

const normalizeInitialValues = (initialData?: UserFormInitialData) => {
  const role = normalizeRoleValue(initialData?.role);
  const company = initialData?.company;
  return {
    name: initialData?.name || "",
    email: initialData?.email || "",
    password: "",
    role,
    company:
      role === ROLES.HR && company?._id
        ? {
            _id: company._id,
            name: company.name,
            logo: company.logo ?? undefined,
          }
        : undefined,
  };
};

interface UserFormProps {
  formId: string;
  initialData?: UserFormInitialData;
  onSubmit: (data: UserFormValues) => Promise<boolean>;
  isLoading?: boolean;
  onDirtyChange?: (isDirty: boolean) => void;
}

export function UserForm({
  formId,
  initialData,
  onSubmit,
  isLoading,
  onDirtyChange,
}: UserFormProps) {
  const { t } = useI18n();
  const [showPassword, setShowPassword] = useState(false);
  const isEditMode = !!initialData;
  const { companies, options } = useCompanyOptions(initialData?.company);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(
      isEditMode ? updateUserFormSchema(t) : createUserFormSchema(t)
    ) as Resolver<UserFormValues>,
    defaultValues: normalizeInitialValues(initialData),
    mode: "onTouched",
    shouldFocusError: false,
  });
  const { isDirty, submitCount } = form.formState;
  useFocusFirstError(submitCount, formId);

  useEffect(() => {
    onDirtyChange?.(isDirty);
    return () => onDirtyChange?.(false);
  }, [isDirty, onDirtyChange]);

  const selectedRole = form.watch("role");

  useEffect(() => {
    if (selectedRole !== ROLES.HR && form.getValues("company")) {
      form.setValue("company", undefined, { shouldDirty: true });
    }
  }, [form, selectedRole]);

  const handleCompanyChange = (companyId: string) => {
    const selected = companies.find((company) => company._id === companyId);
    if (!selected) return;
    form.setValue(
      "company",
      {
        _id: selected._id,
        name: selected.name,
        logo: selected.logo ?? undefined,
      },
      { shouldDirty: true, shouldValidate: true }
    );
  };

  return (
    <Form {...form}>
      <form
        id={formId}
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("adminPages.users.form.name")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoComplete="off"
                  placeholder={t("adminPages.users.form.namePlaceholder")}
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
              <FormLabel>{t("adminPages.users.form.email")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  autoComplete="off"
                  placeholder={t("adminPages.users.form.emailPlaceholder")}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!isEditMode && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("adminPages.users.form.password")}</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className="pr-10"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={t(
                      `adminPages.users.form.${showPassword ? "hidePassword" : "showPassword"}`
                    )}
                    className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Eye className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
                <FormDescription>
                  {t("adminPages.users.form.passwordHint")}
                </FormDescription>
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
              <FormLabel>{t("adminPages.users.form.role")}</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value ?? ""}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("adminPages.users.form.rolePlaceholder")}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ROLE_VALUES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {t(`adminPages.users.roles.${role}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {selectedRole === ROLES.HR && (
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
                    disabled={isLoading || companies.length === 0}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </form>
    </Form>
  );
}
