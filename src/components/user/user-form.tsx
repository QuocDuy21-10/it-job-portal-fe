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
  CreateUserFormData,
  UpdateUserFormData,
  UpdateUserSchema,
  CreateUserSchema,
} from "@/features/user/schemas/user.schema";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useGetRolesQuery } from "@/features/role/redux/role.api";
import { useGetCompaniesQuery } from "@/features/company/redux/company.api";
import { useDebounce } from "@/hooks/use-debounce";
import { Combobox } from "../combo-box";
import { Eye, EyeOff } from "lucide-react";

interface UserFormProps {
  initialData?: Partial<CreateUserFormData>;
  onSubmit: (data: CreateUserFormData | UpdateUserFormData) => Promise<boolean>;
  isLoading?: boolean;
}

export function UserForm({ initialData, onSubmit, isLoading }: UserFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isEditMode = !!initialData;
  // Fetch roles for selection
  const { data: rolesData } = useGetRolesQuery({
    page: 1,
    limit: 100,
  });

  const roles = rolesData?.data?.result || [];

  const [companySearch, setCompanySearch] = useState("");
  const debouncedSearch = useDebounce(companySearch, 500);
  // Fetch companies for selection
  const { data: companiesData } = useGetCompaniesQuery({
    page: 1,
    limit: 100,
    filter: debouncedSearch ? `name=/${debouncedSearch}/i` : "",
  });

  const companies = companiesData?.data?.result || [];
  const companyOptions = companies.map((company: any) => ({
    label: company.name,
    value: company._id,
    logo: company.logo,
  }));

  const form = useForm<CreateUserFormData | UpdateUserFormData>({
    resolver: zodResolver(isEditMode ? UpdateUserSchema : CreateUserSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      password: "",
      age: initialData?.age || 0,
      gender: initialData?.gender || "male",
      address: initialData?.address || "",
      role: initialData?.role || "",
    },
    mode: "onChange",
  });

  // Update company details when selection changes
  const handleCompanyChange = (companyId: string) => {
    const selectedCompany = companies.find(
      (c: { _id: string }) => c._id === companyId
    );
    if (selectedCompany) {
      form.setValue("company", {
        _id: selectedCompany._id,
        name: selectedCompany.name,
        logo: selectedCompany.logo,
      });
    } else {
      form.setValue("company", undefined);
    }
  };

  // Load initial data including role
  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        password: "",
        role: initialData.role || "",
      });
    }
  }, [initialData, form]);

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

        {/* Row 2: Password and Age */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Age <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="0"
                    min={0}
                    max={150}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Row 3: Gender and Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Gender <span className="text-red-500">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    placeholder="Street address"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Replace company fields with Combobox */}
        <FormField
          control={form.control}
          name="company._id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Công ty *</FormLabel>
              <FormControl>
                <Combobox
                  options={companyOptions}
                  value={field.value}
                  onChange={handleCompanyChange}
                  placeholder="Chọn công ty"
                  searchPlaceholder="Tìm kiếm công ty..."
                  emptyText="Không tìm thấy công ty"
                  disabled={isLoading || !!initialData}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Display selected company info */}
        {form.watch("company._id") && (
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <img
              src={form.watch("company.logo") || "/placeholder.png"}
              alt={form.watch("company.name")}
              className="w-12 h-12 object-contain"
            />
            <div>
              <p className="font-medium">{form.watch("company.name")}</p>
              <p className="text-sm text-gray-500">
                ID: {form.watch("company._id")}
              </p>
            </div>
          </div>
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
                defaultValue={field.value}
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

        {/* Show current role info in edit mode */}
        {isEditMode && initialData?.role && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Current Role:{" "}
              {roles.find((r: any) => r._id === form.watch("role"))?.name ||
                "Loading..."}
            </p>
          </div>
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
