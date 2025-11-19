"use client";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import jobTypes from "@/shared/data/job-type.json";
import { DatePicker } from "../date-picker";
import {
  CreateJobFormData,
  JobSchema,
} from "@/features/job/schemas/job.schema";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useGetCompaniesQuery } from "@/features/company/redux/company.api";
import { Combobox } from "../combo-box";
import { RichTextEditor } from "../rich-text-editor";
import { MultiSelect } from "../multi-select";
import jobLevels from "@/shared/data/job-level.json";
import SKILLS_LIST from "@/shared/data/skill-list.json";

interface JobFormProps {
  initialData?: Partial<CreateJobFormData>;
  onSubmit: (data: CreateJobFormData) => Promise<boolean>;
  isLoading?: boolean;
}

export function JobForm({ initialData, onSubmit, isLoading }: JobFormProps) {
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

  const form = useForm<CreateJobFormData>({
    resolver: zodResolver(JobSchema),
    defaultValues: {
      name: initialData?.name || "",
      skills: initialData?.skills || [],
      company: initialData?.company || { _id: "", name: "", logo: null },
      location: initialData?.location || "",
      salary: initialData?.salary || 0,
      quantity: initialData?.quantity || 1,
      level: initialData?.level || "Internship",
      formOfWork: initialData?.formOfWork || "Full-time",
      description: initialData?.description || "",
      startDate: initialData?.startDate || "",
      endDate: initialData?.endDate || "",
      isActive: initialData?.isActive ?? true,
    },
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
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Row 1: Job Name & Level */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên công việc *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="VD: Senior Developer"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cấp độ *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn cấp độ" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {jobLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="formOfWork"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hình thức làm việc *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Hình thức làm việc" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {jobTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Row 2: Location & Quantity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Địa điểm *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="VD: Hà Nội"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kỹ năng *</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={SKILLS_LIST}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Chọn kỹ năng..."
                    searchPlaceholder="Tìm kiếm kỹ năng..."
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Row 3: Salary & Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="salary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lương (VND) *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="0"
                    placeholder="VD: 50000000"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số lượng *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="1"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Row 4: Start Date & End Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày bắt đầu *</FormLabel>
                <FormControl>
                  <DatePicker
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(
                        date ? date.toISOString().split("T")[0] : ""
                      );
                    }}
                    disabled={isLoading}
                    placeholder="Chọn ngày bắt đầu"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày kết thúc *</FormLabel>
                <FormControl>
                  <DatePicker
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(
                        date ? date.toISOString().split("T")[0] : ""
                      );
                    }}
                    disabled={isLoading}
                    placeholder="Chọn ngày kết thúc"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description *</FormLabel>
              <RichTextEditor
                value={field.value}
                onChange={field.onChange}
                disabled={isLoading}
              />
              <FormMessage />
            </FormItem>
          )}
        />

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
                  disabled={isLoading }
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

        {/* Active Status */}
        <div className="flex items-center gap-2">
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormControl>
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    disabled={isLoading}
                    className="w-4 h-4"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <label
            htmlFor="isActive"
            className="text-sm font-medium cursor-pointer"
          >
            Công việc đang tuyển dụng
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Đang lưu..." : initialData ? "Cập nhật" : "Tạo mới"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
