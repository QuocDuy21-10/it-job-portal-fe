"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { z } from "zod";
import { AlertTriangle, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useRequestAccountDeletionMutation,
} from "@/features/auth/redux/auth.api";
import { setLogoutAction } from "@/features/auth/redux/auth.slice";
import { useI18n } from "@/hooks/use-i18n";
import { useRouter } from "@/i18n/navigation";
import { setLoggingOutFlag } from "@/lib/axios/axios-instance";
import { formatLocaleDate } from "@/lib/utils/locale-formatters";

type LocalDeletionFormData = {
  password: string;
};

type OAuthDeletionFormData = {
  confirmText: string;
};

interface AccountDeletionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isGoogleUser: boolean;
}

export function AccountDeletionDialog({
  open,
  onOpenChange,
  isGoogleUser,
}: AccountDeletionDialogProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t, language } = useI18n();
  const [showPassword, setShowPassword] = useState(false);
  const [requestAccountDeletion, { isLoading }] = useRequestAccountDeletionMutation();

  const localDeletionSchema = z.object({
    password: z.string().min(1, t("settings.deleteAccount.confirmPassword")),
  });

  const oAuthDeletionSchema = z.object({
    confirmText: z.string().refine((val) => val === "DELETE", {
      message: t("settings.deleteAccount.confirmText"),
    }),
  });

  const localForm = useForm<LocalDeletionFormData>({
    resolver: zodResolver(localDeletionSchema),
    defaultValues: { password: "" },
  });

  const oauthForm = useForm<OAuthDeletionFormData>({
    resolver: zodResolver(oAuthDeletionSchema),
    defaultValues: { confirmText: "" },
  });

  const handleClose = () => {
    localForm.reset();
    oauthForm.reset();
    setShowPassword(false);
    onOpenChange(false);
  };

  const handleLocalSubmit = async (data: LocalDeletionFormData) => {
    try {
      const result = await requestAccountDeletion({ password: data.password }).unwrap();
      const scheduledDate = result.data?.scheduledDeletionAt
        ? formatLocaleDate(result.data.scheduledDeletionAt, language)
        : "";
      toast.success(t("settings.deleteAccount.requestSuccess", { date: scheduledDate }));
      setLoggingOutFlag(true);
      dispatch(setLogoutAction());
      router.push("/login");
    } catch (error: any) {
      const msg = error?.data?.message || t("settings.deleteAccount.requestError");
      toast.error(msg);
    }
  };

  const handleOAuthSubmit = async (_data: OAuthDeletionFormData) => {
    try {
      const result = await requestAccountDeletion({}).unwrap();
      const scheduledDate = result.data?.scheduledDeletionAt
        ? formatLocaleDate(result.data.scheduledDeletionAt, language)
        : "";
      toast.success(t("settings.deleteAccount.requestSuccess", { date: scheduledDate }));
      setLoggingOutFlag(true);
      dispatch(setLogoutAction());
      router.push("/login");
    } catch (error: any) {
      const msg = error?.data?.message || t("settings.deleteAccount.requestError");
      toast.error(msg);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <AlertDialogTitle className="text-lg font-semibold">
              {t("settings.deleteAccount.title")}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription asChild>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                <p className="text-foreground font-medium">
                  {t("settings.deleteAccount.warningTitle")}
                </p>
              </div>
              <p>
                {t("settings.deleteAccount.warningDescriptionLine1")}
              </p>
              <p>
                {t("settings.deleteAccount.warningDescriptionLine2")}
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        {isGoogleUser ? (
          <form
            onSubmit={oauthForm.handleSubmit(handleOAuthSubmit)}
            className="space-y-4 mt-2"
          >
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t("settings.deleteAccount.confirmTextPrefix")} {" "}
                <code className="px-1.5 py-0.5 bg-muted rounded text-destructive font-mono text-xs">
                  DELETE
                </code>{" "}
                {t("settings.deleteAccount.confirmTextSuffix")}
              </label>
              <input
                type="text"
                {...oauthForm.register("confirmText")}
                className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-destructive/50 focus:border-destructive transition-all"
                placeholder="DELETE"
                disabled={isLoading}
                autoComplete="off"
              />
              {oauthForm.formState.errors.confirmText && (
                <p className="text-sm text-destructive mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {oauthForm.formState.errors.confirmText.message}
                </p>
              )}
            </div>
            <AlertDialogFooter className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleClose}
                disabled={isLoading}
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                variant="destructive"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("settings.deleteAccount.title")}
              </Button>
            </AlertDialogFooter>
          </form>
        ) : (
          <form
            onSubmit={localForm.handleSubmit(handleLocalSubmit)}
            className="space-y-4 mt-2"
          >
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t("settings.deleteAccount.confirmPassword")}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...localForm.register("password")}
                  className="w-full px-3 py-2.5 pr-10 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-destructive/50 focus:border-destructive transition-all"
                  placeholder={t("settings.deleteAccount.passwordPlaceholder")}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-2 flex items-center px-2 text-muted-foreground hover:text-foreground"
                  aria-pressed={showPassword}
                  aria-label={showPassword ? t("settingsPage.hidePassword") : t("settingsPage.showPassword")}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {localForm.formState.errors.password && (
                <p className="text-sm text-destructive mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {localForm.formState.errors.password.message}
                </p>
              )}
            </div>
            <AlertDialogFooter className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleClose}
                disabled={isLoading}
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                variant="destructive"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("settings.deleteAccount.title")}
              </Button>
            </AlertDialogFooter>
          </form>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
