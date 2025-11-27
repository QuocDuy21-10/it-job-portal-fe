"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExperienceRequestSchema, type ExperienceRequest } from "@/features/cv-profile/schemas/cv-profile.schema";
import { useI18n } from "@/hooks/use-i18n";

interface WorkExperience extends ExperienceRequest {
  id?: string;
}

interface WorkExperienceModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  experience?: WorkExperience;
  onClose: () => void;
  onSubmit: (data: ExperienceRequest) => void;
}

export default function WorkExperienceModal({
  isOpen,
  mode,
  experience,
  onClose,
  onSubmit,
}: WorkExperienceModalProps) {
  const { t } = useI18n();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExperienceRequest>({
    resolver: zodResolver(ExperienceRequestSchema),
    mode: "onChange",
    defaultValues: {
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset(experience || {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
      });
    }
  }, [isOpen, experience, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = handleSubmit((data) => {
    onSubmit(data);
    reset();
  });

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            {mode === "add" ? t("cv.workExperience.addTitle") : t("cv.workExperience.editTitle")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Company Name */}
          <Controller
            name="company"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  {t("cv.workExperience.companyLabel")} <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  {...field}
                  placeholder={t("cv.workExperience.companyPlaceholder")}
                  className={`w-full px-4 py-2.5 text-sm border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                    errors.company ? "border-destructive focus:ring-destructive/50" : "border-border"
                  }`}
                />
                {errors.company && (
                  <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
                    <span className="font-medium">⚠</span> {errors.company.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Position */}
          <Controller
            name="position"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  {t("cv.workExperience.positionLabel")} <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  {...field}
                  placeholder={t("cv.workExperience.positionPlaceholder")}
                  className={`w-full px-4 py-2.5 text-sm border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                    errors.position ? "border-destructive focus:ring-destructive/50" : "border-border"
                  }`}
                />
                {errors.position && (
                  <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
                    <span className="font-medium">⚠</span> {errors.position.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Start Date and End Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    {t("cv.workExperience.startDateLabel")} <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="month"
                    value={field.value ? new Date(field.value).toISOString().slice(0, 7) : ""}
                    onChange={(e) => {
                      const dateValue = e.target.value ? new Date(e.target.value + "-01").toISOString() : "";
                      field.onChange(dateValue);
                    }}
                    className={`w-full px-4 py-2.5 text-sm border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                      errors.startDate ? "border-destructive focus:ring-destructive/50" : "border-border"
                    }`}
                  />
                  {errors.startDate && (
                    <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
                      <span className="font-medium">⚠</span> {errors.startDate.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    {t("cv.workExperience.endDateLabel")} <span className="text-muted-foreground text-xs">(Optional)</span>
                  </label>
                  <input
                    type="month"
                    value={field.value ? new Date(field.value).toISOString().slice(0, 7) : ""}
                    onChange={(e) => {
                      const dateValue = e.target.value ? new Date(e.target.value + "-01").toISOString() : "";
                      field.onChange(dateValue);
                    }}
                    placeholder={t("cv.workExperience.endDatePlaceholder")}
                    className={`w-full px-4 py-2.5 text-sm border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                      errors.endDate ? "border-destructive focus:ring-destructive/50" : "border-border"
                    }`}
                  />
                  {errors.endDate && (
                    <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
                      <span className="font-medium">⚠</span> {errors.endDate.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Description */}
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  {t("cv.workExperience.descriptionLabel")} <span className="text-muted-foreground text-xs">(Optional)</span>
                </label>
                <textarea
                  {...field}
                  value={field.value || ""}
                  placeholder={t("cv.workExperience.descriptionPlaceholder")}
                  rows={4}
                  className={`w-full px-4 py-2.5 text-sm border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all ${
                    errors.description ? "border-destructive focus:ring-destructive/50" : "border-border"
                  }`}
                />
                {errors.description && (
                  <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
                    <span className="font-medium">⚠</span> {errors.description.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="px-6"
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              className="px-6 bg-primary hover:bg-primary/90"
            >
              {mode === "add" ? t("cv.workExperience.saveLabel") : t("cv.workExperience.updateLabel")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
