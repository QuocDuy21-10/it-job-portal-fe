"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LanguageRequestSchema, type LanguageRequest } from "@/features/cv-profile/schemas/cv-profile.schema";
import { useI18n } from "@/hooks/use-i18n";

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LanguageRequest) => void;
  initialData?: LanguageRequest & { id?: string };
  mode: "add" | "edit";
}

const PROFICIENCY_LEVELS = ["Beginner", "Intermediate", "Advanced", "Native"];

export default function LanguageModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}: LanguageModalProps) {
  const { t } = useI18n();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LanguageRequest>({
    resolver: zodResolver(LanguageRequestSchema),
    defaultValues: initialData || {
      name: "",
      proficiency: "Intermediate",
    },
  });

  useEffect(() => {
    if (isOpen && initialData) {
      reset(initialData);
    } else if (isOpen && !initialData) {
      reset({
        name: "",
        proficiency: "Intermediate",
      });
    }
  }, [isOpen, initialData, reset]);

  const handleFormSubmit = async (data: LanguageRequest) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-card via-card to-secondary/20 border-border/50 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {mode === "add" ? t("cv.languages.addTitle") : t("cv.languages.editTitle")}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {mode === "add"
              ? t("cv.languages.addDescription")
              : t("cv.languages.editDescription")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 mt-4">
          {/* Language Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-1">
              {t("cv.languages.nameLabel")}
              <span className="text-destructive">*</span>
            </label>
            <input
              {...register("name")}
              type="text"
              placeholder={t("cv.languages.namePlaceholder")}
              className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all ${
                errors.name ? "border-destructive" : "border-border"
              }`}
            />
            {errors.name && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <span className="text-lg">⚠</span>
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Proficiency Level */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-1">
              {t("cv.languages.proficiencyLabel")}
              <span className="text-destructive">*</span>
            </label>
            <select
              {...register("proficiency")}
              className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all ${
                errors.proficiency ? "border-destructive" : "border-border"
              }`}
            >
              {PROFICIENCY_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            {errors.proficiency && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <span className="text-lg">⚠</span>
                {errors.proficiency.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-border hover:bg-secondary/80 transition-all"
            >
              <X className="w-4 h-4 mr-2" />
              {t("cv.languages.cancelButton")}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
            >
              {isSubmitting ? t("cv.languages.savingButton") : mode === "add" ? t("cv.languages.saveButton") : t("cv.languages.updateButton")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
