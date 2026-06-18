import { useState } from "react";
import { toast } from "sonner";
import { ProjectRequest } from "@/features/cv-profile/schemas/cv-profile.schema";
import { useI18n } from "@/hooks/use-i18n";

interface Project extends ProjectRequest {
  id: string;
}

interface UseProjectModalReturn {
  isOpen: boolean;
  mode: "add" | "edit";
  currentProject: (Project & { id?: string }) | undefined;
  openAddModal: () => void;
  openEditModal: (project: Project) => void;
  closeModal: () => void;
  handleSubmit: (data: ProjectRequest) => void;
}

export function useProjectModal(
  projects: Project[],
  onAdd: (project: Project) => void,
  onUpdate: (id: string, field: string, value: string) => void
): UseProjectModalReturn {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [currentProject, setCurrentProject] = useState<Project | undefined>(undefined);

  const openAddModal = () => {
    setMode("add");
    setCurrentProject(undefined);
    setIsOpen(true);
  };

  const openEditModal = (project: Project) => {
    setMode("edit");
    setCurrentProject(project);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setCurrentProject(undefined);
  };

  const handleSubmit = (data: ProjectRequest) => {
    if (mode === "add") {
      const newProject: Project = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...data,
      };
      onAdd(newProject);
      toast.success(t("cv.toasts.projectAddSuccess"), {
        description: t("cv.toasts.projectAdded", { name: data.name }),
        duration: 2000,
      });
    } else if (mode === "edit" && currentProject) {
      onUpdate(currentProject.id, "name", data.name);
      onUpdate(currentProject.id, "position", data.position);
      onUpdate(currentProject.id, "description", data.description);
      onUpdate(currentProject.id, "link", data.link || "");
      toast.success(t("cv.toasts.projectEditSuccess"), {
        description: t("cv.toasts.projectUpdated", { name: data.name }),
        duration: 2000,
      });
    }
    closeModal();
  };

  return {
    isOpen,
    mode,
    currentProject,
    openAddModal,
    openEditModal,
    closeModal,
    handleSubmit,
  };
}
