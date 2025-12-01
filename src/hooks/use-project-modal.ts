import { useState } from "react";
import { toast } from "sonner";
import { ProjectRequest } from "@/features/cv-profile/schemas/cv-profile.schema";

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
      toast.success("Thêm dự án thành công", {
        description: `Đã thêm: ${data.name}`,
        duration: 2000,
      });
    } else if (mode === "edit" && currentProject) {
      onUpdate(currentProject.id, "name", data.name);
      onUpdate(currentProject.id, "position", data.position);
      onUpdate(currentProject.id, "description", data.description);
      onUpdate(currentProject.id, "link", data.link || "");
      toast.success("Cập nhật dự án thành công", {
        description: `Đã cập nhật: ${data.name}`,
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
