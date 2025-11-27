"use client";

import { Plus, Trash2, Edit2, Trophy, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import CVFormSection from "@/components/sections/cv-form-section";
import AwardModal from "../modals/award-modal";
import { useAwardModal } from "@/hooks/use-award-modal";
import { type AwardRequest } from "@/features/cv-profile/schemas/cv-profile.schema";
import { useI18n } from "@/hooks/use-i18n";
import { toast } from "sonner";

interface Award extends AwardRequest {
  id: string;
}

interface AwardsSectionProps {
  awards: Award[];
  onAdd: (award: Award) => void;
  onUpdate: (id: string, field: string, value: string) => void;
  onRemove: (id: string) => void;
}

export default function AwardsSection({
  awards,
  onAdd,
  onUpdate,
  onRemove,
}: AwardsSectionProps) {
  const { t } = useI18n();

  const {
    isOpen,
    mode,
    currentAward,
    openAddModal,
    openEditModal,
    closeModal,
    handleSubmit,
  } = useAwardModal(awards, onAdd, onUpdate);

  const handleDelete = (id: string, name: string) => {
    onRemove(id);
    toast.success("Xóa giải thưởng thành công", {
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
        title={t("cv.awards.title")}
        description={t("cv.awards.description")}
        actionButton={
                <button
                  onClick={openAddModal}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium text-sm shadow-md hover:shadow-lg transition-all"
                >
                  <Plus className="w-4 h-4" />
                  {t("cv.awards.addButton")}
                </button>
        }
      >
        {awards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              {t("cv.awards.noData")}
            </p>
            <p className="text-xs text-muted-foreground mb-6 text-center max-w-md">
              Thêm giải thưởng của bạn để làm nổi bật CV
            </p>
            <Button
              onClick={openAddModal}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
              {t("cv.awards.addButton")}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {awards.map((award) => (
              <Card
                key={award.id}
                className="group relative p-5 bg-gradient-to-br from-card to-secondary/20 border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Trophy className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm mb-1 truncate">
                        {award.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(award.date)}</span>
                      </div>
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
                            onClick={() => openEditModal(award)}
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
                            onClick={() => handleDelete(award.id, award.name)}
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

                {/* Description */}
                {award.description && (
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 border-t border-border/50 pt-3">
                    {award.description}
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </CVFormSection>

      <AwardModal
        isOpen={isOpen}
        mode={mode}
        award={currentAward}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </>
  );
}
