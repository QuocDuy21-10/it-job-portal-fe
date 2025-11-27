"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EducationRequestSchema, type EducationRequest } from "@/features/cv-profile/schemas/cv-profile.schema";
import { useI18n } from "@/hooks/use-i18n";

interface Education extends EducationRequest {
  id?: string;
}

interface EducationModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  education?: Education;
  onClose: () => void;
  onSubmit: (data: EducationRequest) => void;
}

export default function EducationModal({
  isOpen,
  mode,
  education,
  onClose,
  onSubmit,
}: EducationModalProps) {
  const { t } = useI18n();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EducationRequest>({
    resolver: zodResolver(EducationRequestSchema),
    mode: "onChange",
    defaultValues: {
      school: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset(education || {
        school: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        description: "",
      });
    }
  }, [isOpen, education, reset]);

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
            {mode === "add" ? t("cv.education.addTitle") : t("cv.education.editTitle")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* School Name */}
          <Controller
            name="school"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  {t("cv.education.schoolLabel")} <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  {...field}
                  placeholder={t("cv.education.schoolPlaceholder")}
                  className={`w-full px-4 py-2.5 text-sm border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                    errors.school ? "border-destructive focus:ring-destructive/50" : "border-border"
                  }`}
                />
                {errors.school && (
                  <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
                    <span className="font-medium">⚠</span> {errors.school.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Degree and Field */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="degree"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    {t("cv.education.degreeLabel")} <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    {...field}
                    placeholder={t("cv.education.degreePlaceholder")}
                    className={`w-full px-4 py-2.5 text-sm border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                      errors.degree ? "border-destructive focus:ring-destructive/50" : "border-border"
                    }`}
                  />
                  {errors.degree && (
                    <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
                      <span className="font-medium">⚠</span> {errors.degree.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              name="field"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    {t("cv.education.fieldLabel")} <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    {...field}
                    placeholder={t("cv.education.fieldPlaceholder")}
                    className={`w-full px-4 py-2.5 text-sm border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                      errors.field ? "border-destructive focus:ring-destructive/50" : "border-border"
                    }`}
                  />
                  {errors.field && (
                    <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
                      <span className="font-medium">⚠</span> {errors.field.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Start Date and End Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    {t("cv.education.startDateLabel")} <span className="text-destructive">*</span>
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
                    {t("cv.education.endDateLabel")} <span className="text-muted-foreground text-xs">(Optional)</span>
                  </label>
                  <input
                    type="month"
                    value={field.value ? new Date(field.value).toISOString().slice(0, 7) : ""}
                    onChange={(e) => {
                      const dateValue = e.target.value ? new Date(e.target.value + "-01").toISOString() : "";
                      field.onChange(dateValue);
                    }}
                    placeholder={t("cv.education.endDatePlaceholder")}
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
                  {t("cv.education.descriptionLabel")} <span className="text-muted-foreground text-xs">(Optional)</span>
                </label>
                <textarea
                  {...field}
                  value={field.value || ""}
                  placeholder={t("cv.education.descriptionPlaceholder")}
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
              {mode === "add" ? t("cv.education.saveLabel") : t("cv.education.updateLabel")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
