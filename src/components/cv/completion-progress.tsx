"use client";

import { ICVProfile } from "@/shared/types/cv";
import { calculateCVCompletion } from "@/lib/utils/cv-helpers";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";
import { Download, AlertCircle, Save, Loader2, Lightbulb } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface CompletionProgressProps {
  cvData: ICVProfile;
  onSave?: () => void;
  isSaving?: boolean;
  validationErrors?: any[];
  isMobile?: boolean;
}

export default function CompletionProgress({
  cvData,
  onSave,
  isSaving = false,
  validationErrors = [],
  isMobile = false,
}: CompletionProgressProps) {
  const router = useRouter();
  const completion = calculateCVCompletion(cvData);
  const canPreview = completion >= 15;
  const { t } = useI18n();

  // Mobile floating buttons view
  if (isMobile) {
    return (
      <div className="flex flex-col gap-3">
        {/* Preview Button */}
        <Button
          onClick={() => router.push("/profile/cv-preview")}
          disabled={!canPreview}
          className={cn(
            "w-14 h-14 rounded-full shadow-2xl transition-all",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            canPreview ? "bg-primary hover:bg-primary/90" : "bg-secondary"
          )}
          size="icon"
        >
          <Download className="w-6 h-6" />
        </Button>

        {/* Save Button */}
        {onSave && (
          <Button
            onClick={onSave}
            disabled={isSaving || validationErrors.length > 0}
            className={cn(
              "w-14 h-14 rounded-full shadow-2xl transition-all",
              "bg-green-600 hover:bg-green-700",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            size="icon"
          >
            {isSaving ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Save className="w-6 h-6" />
            )}
          </Button>
        )}

        {/* Progress Indicator Badge */}
        <div className={cn(
          "w-14 h-14 rounded-full shadow-lg flex items-center justify-center",
          "bg-gradient-to-br from-card to-card/95 border-2",
          completion >= 80 ? "border-green-500" :
          completion >= 50 ? "border-primary" :
          "border-orange-500"
        )}>
          <span className={cn(
            "text-xs font-bold",
            completion >= 80 ? "text-green-600 dark:text-green-500" :
            completion >= 50 ? "text-primary" :
            "text-orange-600 dark:text-orange-500"
          )}>
            {completion}%
          </span>
        </div>
      </div>
    );
  }

  // Desktop sidebar view
  return (
    <div className="flex flex-col gap-4 w-full select-none">
      {/* 1. Profile Completion Card */}
      <div className="p-5 bg-white dark:bg-card border-x border-b border-t-[3.5px] border-t-primary border-gray-200/80 dark:border-border/60 rounded-xl shadow-sm flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white text-xs font-black">!</span>
            </div>
          </div>
          <h3 className="text-[17px] font-bold text-gray-950 dark:text-gray-50 leading-tight">
            {t("cv.progress.title")}
          </h3>
        </div>

        {/* Progress Bar & Label */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-gray-500 dark:text-gray-400">
              {t("cv.progress.progressLabel")}
            </span>
            <span className="font-bold text-primary text-sm">
              {completion}%
            </span>
          </div>
          <div className="w-full h-3 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 rounded-full"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>

        {/* Checklist */}
        <div className="space-y-3 pt-2">
          <p className="text-[11px] font-bold text-gray-700 dark:text-gray-300 tracking-wider">
            {t("cv.progress.checklistTitle")}
          </p>
          <div className="space-y-2.5">
            {[
              { key: 'personalInfo', label: t("cv.progress.personalInfo"), completed: cvData.personalInfo.fullName && cvData.personalInfo.email },
              { key: 'education', label: t("cv.progress.education"), completed: cvData.education.length > 0 },
              { key: 'experience', label: t("cv.progress.experience"), completed: cvData.experience.length > 0 },
              { key: 'skills', label: t("cv.progress.skills"), completed: cvData.skills.length > 0 },
              { key: 'languages', label: t("cv.progress.languages"), completed: cvData.languages.length > 0 },
            ].map((item) => (
              <div key={item.key} className="flex items-center gap-3">
                <div className={cn(
                  "w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all duration-300",
                  item.completed ? "bg-primary" : "bg-gray-300 dark:bg-zinc-700"
                )} />
                <span className={cn(
                  "text-sm transition-colors",
                  item.completed 
                    ? "text-gray-700 dark:text-gray-300 font-medium" 
                    : "text-gray-400 dark:text-zinc-500 font-medium"
                )}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Warning message if cannot preview */}
      {!canPreview && (
        <div className="flex items-start gap-2.5 text-xs bg-yellow-50 dark:bg-yellow-950/20 text-yellow-800 dark:text-yellow-200 p-3.5 rounded-xl border border-yellow-200 dark:border-yellow-900 shadow-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-yellow-600 dark:text-yellow-400" />
          <p className="leading-relaxed">
            {t("cv.progress.notEnough", { percent: 15 })}
          </p>
        </div>
      )}

      {/* 2. Preview & Download Button Card */}
      <Button
        onClick={() => router.push("/profile/cv-preview")}
        disabled={!canPreview}
        className={cn(
          "w-full h-12 rounded-xl border-2 font-bold transition-all flex items-center justify-center gap-2",
          "shadow-sm hover:shadow-md active:scale-[0.99]",
          canPreview 
            ? "border-primary text-primary hover:bg-primary/5 bg-white dark:bg-card" 
            : "border-gray-200 text-gray-400 bg-gray-50/50 dark:bg-zinc-800/50 dark:border-zinc-700/60"
        )}
      >
        <Download className="w-5 h-5 flex-shrink-0" />
        <span>{t("cv.progress.previewDownload")}</span>
      </Button>

      {/* 3. Save CV Button Card */}
      {onSave && (
        <div className="w-full flex flex-col gap-2">
          <Button
            onClick={onSave}
            disabled={isSaving || validationErrors.length > 0}
            className={cn(
              "w-full h-12 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2",
              "bg-primary hover:bg-primary/90 shadow-[0_4px_12px_rgba(37,99,235,0.15)] dark:shadow-none active:scale-[0.99]",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none"
            )}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin flex-shrink-0" />
                <span>Đang lưu CV...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5 flex-shrink-0" />
                <span>Lưu CV</span>
                {validationErrors.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold">
                    {validationErrors.length}
                  </span>
                )}
              </>
            )}
          </Button>

          {validationErrors.length > 0 && (
            <p className="text-xs text-destructive text-center font-semibold mt-1">
              Vui lòng sửa các lỗi trước khi lưu
            </p>
          )}
        </div>
      )}

      {/* 4. Tips Card */}
      <div className="p-4 bg-[#f5f6f8] dark:bg-zinc-800/40 border border-gray-200 dark:border-zinc-700/50 rounded-xl flex items-start gap-3 shadow-sm">
        <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
          {t("cv.progress.tip")}
        </p>
      </div>
    </div>
  );
}
