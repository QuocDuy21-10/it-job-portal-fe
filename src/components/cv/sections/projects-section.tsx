"use client";

import { Plus, Trash2, Edit2, FolderGit2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import CVFormSection from "@/components/sections/cv-form-section";
import ProjectModal from "../modals/project-modal";
import { useProjectModal } from "@/hooks/use-project-modal";
import { type ProjectRequest } from "@/features/cv-profile/schemas/cv-profile.schema";
import { useI18n } from "@/hooks/use-i18n";
import { toast } from "sonner";
import { formatLocaleDate } from "@/lib/utils/locale-formatters";

interface Project extends ProjectRequest {
  id: string;
}

interface ProjectsSectionProps {
  projects: Project[];
  onAdd: (project: Project) => void;
  onUpdate: (id: string, field: string, value: string) => void;
  onRemove: (id: string) => void;
}

export default function ProjectsSection({
  projects,
  onAdd,
  onUpdate,
  onRemove,
}: ProjectsSectionProps) {
  const { t, language } = useI18n();

  const {
    isOpen,
    mode,
    currentProject,
    openAddModal,
    openEditModal,
    closeModal,
    handleSubmit,
  } = useProjectModal(projects, onAdd, onUpdate);

  const handleDelete = (id: string, name: string) => {
    onRemove(id);
    toast.success("Xóa dự án thành công", {
      description: `Đã xóa: ${name}`,
      duration: 2000,
    });
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return language === "vi" ? "Hiện tại" : "Present";

    return formatLocaleDate(date, language, {
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <>
      <CVFormSection
        title={t("cv.projects.title")}
        description={t("cv.projects.description")}
        actionButton={
            <Button
              onClick={openAddModal}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
              {t("cv.projects.addButton")}
            </Button>
        }
      >
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <FolderGit2 className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              {t("cv.projects.noData")}
            </p>
            <p className="text-xs text-muted-foreground mb-6 text-center max-w-md">
              Thêm các dự án bạn đã tham gia để làm nổi bật kinh nghiệm thực tế
            </p>

          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="group relative p-5 bg-gradient-to-br from-card to-secondary/20 border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <FolderGit2 className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm mb-1 truncate">
                        {project.name}
                      </h3>
                      {project.position && (
                        <p className="text-xs text-muted-foreground font-medium mb-1">
                          {project.position}
                        </p>
                      )}
                      {project.link && (
                        <a 
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary font-medium hover:underline truncate block"
                        >
                          {project.link}
                        </a>
                      )}
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
                            onClick={() => openEditModal(project)}
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
                            onClick={() => handleDelete(project.id, project.name)}
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
                {project.description && (
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 pt-3">
                    {project.description}
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </CVFormSection>

      <ProjectModal
        isOpen={isOpen}
        mode={mode}
        project={currentProject}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </>
  );
}
