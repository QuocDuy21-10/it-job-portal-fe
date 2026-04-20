"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCancelAccountDeletionByTokenMutation } from "@/features/auth/redux/auth.api";
import { useI18n } from "@/hooks/use-i18n";

type PageState = "idle" | "loading" | "success" | "error";

function CancelDeletionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();

  const token = searchParams.get("token");

  const [pageState, setPageState] = useState<PageState>(
    token ? "idle" : "error"
  );
  const [errorMessage, setErrorMessage] = useState<string>(
    token ? "" : t("settings.deleteAccount.cancelByToken.missingToken")
  );
  const [countdown, setCountdown] = useState(5);

  const [cancelAccountDeletionByToken] =
    useCancelAccountDeletionByTokenMutation();

  // Countdown redirect after success
  useEffect(() => {
    if (pageState !== "success") return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }

    router.push("/login");
  }, [pageState, countdown, router]);

  const handleKeepAccount = async () => {
    if (!token) return;

    setPageState("loading");

    try {
      await cancelAccountDeletionByToken({ token }).unwrap();
      setPageState("success");
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      const msg =
        apiError?.data?.message ||
        t("settings.deleteAccount.cancelByToken.invalidToken");
      setErrorMessage(msg);
      setPageState("error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-2">
          {pageState === "idle" || pageState === "loading" ? (
            <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-primary" />
          ) : pageState === "success" ? (
            <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-green-500" />
          ) : (
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
          )}

          <CardTitle className="text-xl">
            {pageState === "success"
              ? t("settings.deleteAccount.cancelByToken.successTitle")
              : t("settings.deleteAccount.cancelByToken.pageTitle")}
          </CardTitle>

          <CardDescription className="mt-2 text-sm text-muted-foreground">
            {pageState === "success"
              ? t("settings.deleteAccount.cancelByToken.successMessage")
              : pageState === "error"
                ? errorMessage
                : t("settings.deleteAccount.cancelByToken.description")}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-4 pt-4">
          {pageState === "idle" && (
            <Button
              className="w-full"
              onClick={handleKeepAccount}
            >
              {t("settings.deleteAccount.cancelByToken.keepAccount")}
            </Button>
          )}

          {pageState === "loading" && (
            <Button className="w-full" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("settings.deleteAccount.cancelByToken.keepAccount")}
            </Button>
          )}

          {pageState === "success" && (
            <>
              <p className="text-sm text-muted-foreground">
                {t("settings.deleteAccount.cancelByToken.redirecting").replace(
                  "{count}",
                  String(countdown)
                )}
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/login">
                  {t("settings.deleteAccount.cancelByToken.goToLogin")}
                </Link>
              </Button>
            </>
          )}

          {pageState === "error" && (
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">
                {t("settings.deleteAccount.cancelByToken.goToLogin")}
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function CancelDeletionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <CancelDeletionContent />
    </Suspense>
  );
}
