"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Mail } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { selectUser } from "@/features/auth/redux/auth.slice";
import { updateUserLoginInfo } from "@/features/auth/redux/auth.helpers";
import { useUpdateUserMutation } from "@/features/user/redux/user.api";
import { useI18n } from "@/hooks/use-i18n";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function PersonalInfoPage() {
  const { t } = useI18n();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const personalInfoSchema = useMemo(() => {
    return z.object({
      name: z.string().min(2, t("authModal.validation.name.min") || "Name must be at least 2 characters"),
      email: z.string().email(t("authModal.validation.email.invalid") || "Invalid email address"),
    });
  }, [t]);

  type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

  const defaultValues = useMemo(() => {
    return {
      name: user?.name || "",
      email: user?.email || "",
    };
  }, [user]);

  const form = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const getUserInitials = () => {
    if (!user?.name) return "AD";
    const names = user.name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  };

  const onSubmit = async (data: PersonalInfoFormData) => {
    if (!user?._id) return;
    try {
      const payload: any = {
        name: data.name,
        email: data.email,
        role: user.role,
      };

      const userAsAny = user as any;
      if (userAsAny.company?._id) {
        payload.company = userAsAny.company;
      }

      const response = await updateUser({
        id: user._id,
        data: payload,
      }).unwrap();

      if (response.data) {
        const updatedUser = {
          ...user,
          name: response.data.name,
          email: response.data.email,
        };
        updateUserLoginInfo(dispatch, updatedUser);
      }
      toast.success(t("adminPages.personalInfo.toasts.success") || "Cập nhật thông tin thành công!");
    } catch (error: any) {
      console.error("Update personal info error:", error);
      const msg = error?.data?.message || t("adminPages.personalInfo.toasts.error") || "Cập nhật thông tin thất bại.";
      toast.error(msg);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-in">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-sm">
              <User className="h-4 w-4 text-white" />
            </div>
            <h1 className="admin-page-title">{t("adminPages.personalInfo.title")}</h1>
          </div>
          <p className="admin-page-description">
            {t("adminPages.personalInfo.description")}
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="admin-card p-6 bg-white dark:bg-card">
        {/* Profile Card */}
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4 pb-6 border-b border-gray-200 dark:border-border mb-6">
          <Avatar className="h-16 w-16 shadow-md border border-border">
            <AvatarImage
              src={user?.avatar || undefined}
              alt={user?.name || "User Avatar"}
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white text-lg font-bold">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left space-y-1.5 mt-1">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {user?.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
            {user?.role && (
              <Badge variant="secondary" className="text-xs">
                {user.role}
              </Badge>
            )}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5 font-medium">
                    <User className="h-4 w-4 text-gray-400" />
                    {t("adminPages.personalInfo.nameLabel") || "Họ và tên"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("authModal.register.fields.name.placeholder") || "Nguyễn Văn A"}
                      disabled={isUpdating}
                      className="bg-gray-50/50 dark:bg-secondary/30 focus-ring-primary"
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
                  <FormLabel className="flex items-center gap-1.5 font-medium">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {t("adminPages.personalInfo.emailLabel") || "Địa chỉ Email"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder={t("authModal.register.fields.email.placeholder") || "example@email.com"}
                      disabled={true}
                      className="bg-gray-50/50 dark:bg-secondary/30 focus-ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-border">
              <Button
                type="submit"
                className="admin-btn-primary px-6"
                disabled={isUpdating || !form.formState.isDirty}
              >
                {isUpdating
                  ? t("adminPages.personalInfo.submitting") || "Đang lưu..."
                  : t("adminPages.personalInfo.submit") || "Cập nhật thông tin"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
