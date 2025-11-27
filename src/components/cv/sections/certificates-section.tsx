"use client";

import { Plus, Trash2, Edit2, Award as AwardIcon, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import CVFormSection from "@/components/sections/cv-form-section";
import CertificateModal from "../modals/certificate-modal";
import { useCertificateModal } from "@/hooks/use-certificate-modal";
import { type CertificateRequest } from "@/features/cv-profile/schemas/cv-profile.schema";
import { useI18n } from "@/hooks/use-i18n";
import { toast } from "sonner";

interface Certificate extends CertificateRequest {
  id: string;
}

interface CertificatesSectionProps {
  certificates: Certificate[];
  onAdd: (cert: Certificate) => void;
  onUpdate: (id: string, field: string, value: string) => void;
  onRemove: (id: string) => void;
}

export default function CertificatesSection({
  certificates,
  onAdd,
  onUpdate,
  onRemove,
}: CertificatesSectionProps) {
  const { t } = useI18n();

  const {
    isOpen,
    mode,
    currentCertificate,
    openAddModal,
    openEditModal,
    closeModal,
    handleSubmit,
  } = useCertificateModal(certificates, onAdd, onUpdate);

  const handleDelete = (id: string, name: string) => {
    onRemove(id);
    toast.success("Xóa chứng chỉ thành công", {
      description: `Đã xóa: ${name}`,
      duration: 2000,
    });
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("vi-VN", { month: "2-digit", year: "numeric" });
  };

  return (
    <>
      <CVFormSection
        title={t("cv.certificates.title")}
        description={t("cv.certificates.description")}
        actionButton={
                <button
                  onClick={openAddModal}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium text-sm shadow-md hover:shadow-lg transition-all"
                >
                  <Plus className="w-4 h-4" />
                  {t("cv.certificates.addButton")}
                </button>
        }
      >
        {certificates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <AwardIcon className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              {t("cv.certificates.noData")}
            </p>
            <p className="text-xs text-muted-foreground mb-6 text-center max-w-md">
              Thêm chứng chỉ của bạn để tăng uy tín với nhà tuyển dụng
            </p>
            <Button
              onClick={openAddModal}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
              {t("cv.certificates.addButton")}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <Card
                key={cert.id}
                className="group relative p-5 bg-gradient-to-br from-card to-secondary/20 border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <AwardIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm mb-1 truncate">
                        {cert.name}
                      </h3>
                      <p className="text-xs text-primary font-medium truncate">
                        {cert.issuer}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditModal(cert)}
                            className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Chỉnh sửa</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(cert.id, cert.name)}
                            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Xóa</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(cert.date)}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CVFormSection>

      <CertificateModal
        isOpen={isOpen}
        mode={mode}
        certificate={currentCertificate}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </>
  );
}
