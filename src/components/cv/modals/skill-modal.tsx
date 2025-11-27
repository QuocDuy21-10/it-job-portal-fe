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
import { SkillRequestSchema, type SkillRequest } from "@/features/cv-profile/schemas/cv-profile.schema";
import { useI18n } from "@/hooks/use-i18n";

interface SkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SkillRequest) => void;
  initialData?: SkillRequest & { id?: string };
  mode: "add" | "edit";
}

const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];

export default function SkillModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}: SkillModalProps) {
  const { t } = useI18n();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SkillRequest>({
    resolver: zodResolver(SkillRequestSchema),
    defaultValues: initialData || {
      name: "",
      level: "Intermediate",
    },
  });

  useEffect(() => {
    if (isOpen && initialData) {
      reset(initialData);
    } else if (isOpen && !initialData) {
      reset({
        name: "",
        level: "Intermediate",
      });
    }
  }, [isOpen, initialData, reset]);

  const handleFormSubmit = async (data: SkillRequest) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-card via-card to-secondary/20 border-border/50 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {mode === "add" ? t("cv.skills.addTitle") : t("cv.skills.editTitle")}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {mode === "add"
              ? t("cv.skills.addDescription")
              : t("cv.skills.editDescription")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 mt-4">
          {/* Skill Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-1">
              {t("cv.skills.nameLabel")}
              <span className="text-destructive">*</span>
            </label>
            <input
              {...register("name")}
              type="text"
              placeholder={t("cv.skills.namePlaceholder")}
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

          {/* Skill Level */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-1">
              {t("cv.skills.levelLabel")}
              <span className="text-destructive">*</span>
            </label>
            <select
              {...register("level")}
              className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all ${
                errors.level ? "border-destructive" : "border-border"
              }`}
            >
              {SKILL_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            {errors.level && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <span className="text-lg">⚠</span>
                {errors.level.message}
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
              {t("cv.skills.cancelButton")}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
            >
              {isSubmitting ? t("cv.skills.savingButton") : mode === "add" ? t("cv.skills.saveButton") : t("cv.skills.updateButton")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
