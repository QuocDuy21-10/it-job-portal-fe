"use client";

import { Plus, Trash2, Edit2, GraduationCap, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import CVFormSection from "@/components/sections/cv-form-section";
import EducationModal from "../modals/education-modal";
import { useEducationModal } from "@/hooks/use-education-modal";
import { type EducationRequest } from "@/features/cv-profile/schemas/cv-profile.schema";
import { useI18n } from "@/hooks/use-i18n";
import { toast } from "sonner";

interface Education extends EducationRequest {
  id: string;
}

interface EducationSectionProps {
  education: Education[];
  onAdd: (edu: Education) => void;
  onUpdate: (id: string, field: string, value: string) => void;
  onRemove: (id: string) => void;
}

export default function EducationSection({
  education,
  onAdd,
  onUpdate,
  onRemove,
}: EducationSectionProps) {
  const { t } = useI18n();
  
  const {
    isOpen,
    mode,
    currentEducation,
    openAddModal,
    openEditModal,
    closeModal,
    handleSubmit,
  } = useEducationModal(education, onAdd, onUpdate);

  const handleDelete = (id: string, school: string) => {
    onRemove(id);
    toast.success("Xóa học vấn thành công", {
      description: `Đã xóa: ${school}`,
      duration: 2000,
    });
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "Present";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("vi-VN", { month: "2-digit", year: "numeric" });
  };

  return (
    <>
      <CVFormSection
        title={t("cv.education.title")}
        description={t("cv.education.description")}
        actionButton={
                <button
                  onClick={openAddModal}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium text-sm shadow-md hover:shadow-lg transition-all"
                >
                  <Plus className="w-4 h-4" />
                  {t("cv.education.addButton")}
                </button>
        }
      >
        {education.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              {t("cv.education.noData")}
            </p>
            <p className="text-xs text-muted-foreground mb-6 text-center max-w-md">
              Thêm thông tin học vấn của bạn để tạo CV chuyên nghiệp hơn
            </p>
            <Button
              onClick={openAddModal}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 " />
              {t("cv.education.addButton")}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {education.map((edu) => (
              <Card
                key={edu.id}
                className="group relative p-5 bg-gradient-to-br from-card to-secondary/20 border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <GraduationCap className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm mb-1 truncate">
                        {edu.school}
                      </h3>
                      <p className="text-xs text-primary font-medium">
                        {edu.degree}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {edu.field}
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
                            onClick={() => openEditModal(edu)}
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
                            onClick={() => handleDelete(edu.id, edu.school)}
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

                {/* Date Range */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </span>
                </div>

                {/* Description */}
                {edu.description && (
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 border-t border-border/50 pt-3">
                    {edu.description}
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </CVFormSection>

      <EducationModal
        isOpen={isOpen}
        mode={mode}
        education={currentEducation}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </>
  );
}
