"use client";

import { Plus, Edit, Trash2, Award } from 'lucide-react';
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CVFormSection from "@/components/sections/cv-form-section";
import SkillModal from "@/components/cv/modals/skill-modal";
import { useSkillModal } from "@/hooks/use-skill-modal";
import { toast } from "sonner";

interface Skill {
  id: string;
  name: string;
  level: string;
}

interface SkillsSectionProps {
  skills: Skill[];
  onAdd: (skill: Skill) => void;
  onUpdate: (id: string, field: string, value: string) => void;
  onRemove: (id: string) => void;
}

const SKILL_LEVEL_COLORS: Record<string, string> = {
  Beginner: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Intermediate: "bg-green-500/10 text-green-600 dark:text-green-400",
  Advanced: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  Expert: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
};

export default function SkillsSection({
  skills,
  onAdd,
  onUpdate,
  onRemove,
}: SkillsSectionProps) {
  const skillModal = useSkillModal(skills, onAdd, onUpdate);

  const handleRemove = (id: string, name: string) => {
    toast.success("Đã xóa kỹ năng", {
      description: `Kỹ năng "${name}" đã được xóa`,
      duration: 2000,
    });
    onRemove(id);
  };

  return (
    <>
      <CVFormSection
        title="Kỹ Năng Chuyên Môn"
        description={`Thêm các kỹ năng của bạn (${skills.length}/20)`}
        actionButton={
          skills.length < 20 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={skillModal.openAddModal}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium text-sm shadow-md hover:shadow-lg transition-all hover:scale-105"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm Kỹ Năng
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Thêm kỹ năng chuyên môn mới</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        }
      >
        {skills.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-xl border-2 border-dashed border-border/50">
            <Award className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <p className="text-base font-medium text-muted-foreground mb-2">
              Chưa có kỹ năng nào
            </p>
            <p className="text-sm text-muted-foreground/70 text-center max-w-md">
              Thêm các kỹ năng chuyên môn để nổi bật hồ sơ của bạn
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <Card
                key={skill.id}
                className="group relative overflow-hidden bg-gradient-to-br from-card to-secondary/20 border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-base text-foreground mb-2 line-clamp-1">
                        {skill.name}
                      </h4>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          SKILL_LEVEL_COLORS[skill.level] || SKILL_LEVEL_COLORS.Intermediate
                        }`}
                      >
                        {skill.level}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-border/30">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => skillModal.openEditModal(skill)}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium transition-all hover:scale-105"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            Sửa
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Chỉnh sửa kỹ năng này</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => handleRemove(skill.id, skill.name)}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-destructive/10 hover:bg-destructive/20 text-destructive text-xs font-medium transition-all hover:scale-105"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Xóa
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Xóa kỹ năng này</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CVFormSection>

      <SkillModal
        isOpen={skillModal.isOpen}
        onClose={skillModal.closeModal}
        onSubmit={skillModal.handleSubmit}
        initialData={skillModal.currentSkill}
        mode={skillModal.mode}
      />
    </>
  );
}
