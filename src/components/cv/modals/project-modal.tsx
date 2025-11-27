"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProjectRequestSchema, type ProjectRequest } from "@/features/cv-profile/schemas/cv-profile.schema";
import { useI18n } from "@/hooks/use-i18n";

interface Project extends ProjectRequest {
  id?: string;
}

interface ProjectModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  project?: Project;
  onClose: () => void;
  onSubmit: (data: ProjectRequest) => void;
}

export default function ProjectModal({
  isOpen,
  mode,
  project,
  onClose,
  onSubmit,
}: ProjectModalProps) {
  const { t } = useI18n();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectRequest>({
    resolver: zodResolver(ProjectRequestSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      link: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset(project || {
        name: "",
        description: "",
        link: "",
      });
    }
  }, [isOpen, project, reset]);

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
            {mode === "add" ? t("cv.projects.addTitle") : t("cv.projects.editTitle")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Project Name */}
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  {t("cv.projects.nameLabel")} <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  {...field}
                  placeholder={t("cv.projects.namePlaceholder")}
                  className={`w-full px-4 py-2.5 text-sm border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                    errors.name ? "border-destructive focus:ring-destructive/50" : "border-border"
                  }`}
                />
                {errors.name && (
                  <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
                    <span className="font-medium">⚠</span> {errors.name.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Project Link */}
          <Controller
            name="link"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  {t("cv.projects.linkLabel")} <span className="text-muted-foreground text-xs">(Optional)</span>
                </label>
                <input
                  type="url"
                  {...field}
                  value={field.value || ""}
                  placeholder={t("cv.projects.linkPlaceholder")}
                  className={`w-full px-4 py-2.5 text-sm border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                    errors.link ? "border-destructive focus:ring-destructive/50" : "border-border"
                  }`}
                />
                {errors.link && (
                  <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
                    <span className="font-medium">⚠</span> {errors.link.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Description */}
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  {t("cv.projects.descriptionLabel")} <span className="text-destructive">*</span>
                </label>
                <textarea
                  {...field}
                  placeholder={t("cv.projects.descriptionPlaceholder")}
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
              {mode === "add" ? t("cv.projects.saveLabel") : t("cv.projects.updateLabel")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
