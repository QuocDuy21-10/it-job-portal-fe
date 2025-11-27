"use client";

import { ICVProfile } from "@/shared/types/cv";
import { calculateCVCompletion } from "@/lib/utils/cv-helpers";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";
import { Download, AlertCircle, Save, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface CompletionProgressProps {
  cvData: ICVProfile;
  onSave?: () => void;
  isSaving?: boolean;
  validationErrors?: any[];
}

export default function CompletionProgress({
  cvData,
  onSave,
  isSaving = false,
  validationErrors = [],
}: CompletionProgressProps) {
  const router = useRouter();
  const completion = calculateCVCompletion(cvData);
  const canPreview = completion >= 15;
  const { t } = useI18n();

  return (
    <div className="sticky top-4 space-y-4">
      {/* Progress Card */}
      <div className="p-6 bg-gradient-to-br from-card to-card/95 border border-border/50 rounded-xl shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <AlertCircle className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-foreground">
            {t("cv.progress.title")}
          </h3>
        </div>

        <div className="space-y-4">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                {t("cv.progress.progressLabel")}
              </span>
              <span className={cn(
                "text-sm font-bold",
                completion >= 80 ? "text-green-600 dark:text-green-500" :
                completion >= 50 ? "text-primary" :
                "text-orange-600 dark:text-orange-500"
              )}>
                {completion}%
              </span>
            </div>
            <div className="w-full h-3 bg-secondary/50 rounded-full overflow-hidden shadow-inner">
              <div
                className={cn(
                  "h-full transition-all duration-500 ease-out rounded-full",
                  completion >= 80 ? "bg-gradient-to-r from-green-500 to-green-600" :
                  completion >= 50 ? "bg-gradient-to-r from-primary to-primary/80" :
                  "bg-gradient-to-r from-orange-500 to-orange-600"
                )}
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-2 mt-4 p-3 bg-secondary/20 rounded-lg">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Hoàn thành các mục:</p>
            {[
              { key: 'personalInfo', label: t("cv.progress.personalInfo"), completed: cvData.personalInfo.fullName && cvData.personalInfo.email },
              { key: 'education', label: t("cv.progress.education"), completed: cvData.education.length > 0 },
              { key: 'experience', label: t("cv.progress.experience"), completed: cvData.experience.length > 0 },
              { key: 'skills', label: t("cv.progress.skills"), completed: cvData.skills.length > 0 },
              { key: 'languages', label: t("cv.progress.languages"), completed: cvData.languages.length > 0 },
            ].map((item) => (
              <div key={item.key} className="flex items-center gap-2 text-xs">
                <div className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  item.completed ? "bg-primary shadow-md shadow-primary/50" : "bg-border"
                )} />
                <span className={cn(
                  "transition-colors",
                  item.completed ? "text-foreground font-medium" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Preview & Download Button */}
          <div className="mt-4 pt-4 border-t border-border/50">
            {!canPreview && (
              <div className="mb-3 flex items-start gap-2 text-xs bg-yellow-50 dark:bg-yellow-950/20 text-yellow-800 dark:text-yellow-200 p-3 rounded-lg border border-yellow-200 dark:border-yellow-900">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>
                  {t("cv.progress.notEnough").replace("{percent}", "15")}
                </p>
              </div>
            )}
            <Button
              onClick={() => router.push("/profile/cv-preview")}
              disabled={!canPreview}
              className={cn(
                "w-full font-semibold shadow-md hover:shadow-lg transition-all",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                canPreview && "hover:scale-105"
              )}
              variant={canPreview ? "default" : "secondary"}
            >
              <Download className="w-4 h-4 mr-2" />
              {t("cv.progress.previewDownload")}
            </Button>
          </div>
        </div>
      </div>

      {/* Save Button Card */}
      {onSave && (
        <div className="p-4 bg-gradient-to-br from-card to-card/95 border border-border/50 rounded-xl shadow-lg backdrop-blur-sm">
          <Button
            onClick={onSave}
            disabled={isSaving || validationErrors.length > 0}
            size="lg"
            className={cn(
              "w-full font-bold shadow-lg hover:shadow-xl transition-all",
              "bg-gradient-to-r from-primary to-primary/80",
              "hover:from-primary/90 hover:to-primary/70",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              !isSaving && validationErrors.length === 0 && "hover:scale-105"
            )}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Đang lưu CV...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Lưu CV
                {validationErrors.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-destructive/20 text-xs font-semibold">
                    {validationErrors.length} lỗi
                  </span>
                )}
              </>
            )}
          </Button>
          
          {validationErrors.length > 0 && (
            <p className="mt-2 text-xs text-destructive text-center font-medium">
              Vui lòng sửa các lỗi trước khi lưu
            </p>
          )}
        </div>
      )}
    </div>
  );
}
