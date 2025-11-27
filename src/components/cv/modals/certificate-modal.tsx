"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CertificateRequestSchema, type CertificateRequest } from "@/features/cv-profile/schemas/cv-profile.schema";
import { useI18n } from "@/hooks/use-i18n";

interface Certificate extends CertificateRequest {
  id?: string;
}

interface CertificateModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  certificate?: Certificate;
  onClose: () => void;
  onSubmit: (data: CertificateRequest) => void;
}

export default function CertificateModal({
  isOpen,
  mode,
  certificate,
  onClose,
  onSubmit,
}: CertificateModalProps) {
  const { t } = useI18n();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CertificateRequest>({
    resolver: zodResolver(CertificateRequestSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      issuer: "",
      date: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset(certificate || {
        name: "",
        issuer: "",
        date: "",
      });
    }
  }, [isOpen, certificate, reset]);

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
            {mode === "add" ? t("cv.certificates.addTitle") : t("cv.certificates.editTitle")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Certificate Name */}
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  {t("cv.certificates.nameLabel")} <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  {...field}
                  placeholder={t("cv.certificates.namePlaceholder")}
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

          {/* Issuer */}
          <Controller
            name="issuer"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  {t("cv.certificates.issuerLabel")} <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  {...field}
                  placeholder={t("cv.certificates.issuerPlaceholder")}
                  className={`w-full px-4 py-2.5 text-sm border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                    errors.issuer ? "border-destructive focus:ring-destructive/50" : "border-border"
                  }`}
                />
                {errors.issuer && (
                  <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
                    <span className="font-medium">⚠</span> {errors.issuer.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Date */}
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  {t("cv.certificates.dateLabel")} <span className="text-destructive">*</span>
                </label>
                <input
                  type="month"
                  value={field.value ? new Date(field.value).toISOString().slice(0, 7) : ""}
                  onChange={(e) => {
                    const dateValue = e.target.value ? new Date(e.target.value + "-01").toISOString() : "";
                    field.onChange(dateValue);
                  }}
                  className={`w-full px-4 py-2.5 text-sm border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                    errors.date ? "border-destructive focus:ring-destructive/50" : "border-border"
                  }`}
                />
                {errors.date && (
                  <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
                    <span className="font-medium">⚠</span> {errors.date.message}
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
              {mode === "add" ? t("cv.certificates.saveLabel") : t("cv.certificates.updateLabel")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
