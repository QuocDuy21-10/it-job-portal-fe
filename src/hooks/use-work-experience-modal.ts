import { useState } from "react";
import { toast } from "sonner";
import { ExperienceRequest } from "@/features/cv-profile/schemas/cv-profile.schema";
import { useI18n } from "./use-i18n";

interface WorkExperience extends ExperienceRequest {
  id: string;
}

interface UseWorkExperienceModalReturn {
  isOpen: boolean;
  mode: "add" | "edit";
  currentExperience: (WorkExperience & { id?: string }) | undefined;
  openAddModal: () => void;
  openEditModal: (experience: WorkExperience) => void;
  closeModal: () => void;
  handleSubmit: (data: ExperienceRequest) => void;
}

export function useWorkExperienceModal(
  experiences: WorkExperience[],
  onAdd: (experience: WorkExperience) => void,
  onUpdate: (id: string, field: string, value: string) => void
): UseWorkExperienceModalReturn {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [currentExperience, setCurrentExperience] = useState<WorkExperience | undefined>(undefined);

  const openAddModal = () => {
    setMode("add");
    setCurrentExperience(undefined);
    setIsOpen(true);
  };

  const openEditModal = (experience: WorkExperience) => {
    setMode("edit");
    setCurrentExperience(experience);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setCurrentExperience(undefined);
  };

  const handleSubmit = (data: ExperienceRequest) => {
    if (mode === "add") {
      const newExperience: WorkExperience = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...data,
      };
      onAdd(newExperience);
      toast.success(t("cv.workExperience.addSuccess"), {
        description: `${t("cv.workExperience.addSuccessDesc")}: ${data.company} - ${data.position}`,
        duration: 2000,
      });
    } else if (mode === "edit" && currentExperience) {
      onUpdate(currentExperience.id, "company", data.company);
      onUpdate(currentExperience.id, "position", data.position);
      onUpdate(currentExperience.id, "startDate", data.startDate);
      onUpdate(currentExperience.id, "endDate", data.endDate || "");
      onUpdate(currentExperience.id, "description", data.description || "");
      toast.success(t("cv.workExperience.updateSuccess"), {
        description: `${t("cv.workExperience.updateSuccessDesc")}: ${data.company}`,
        duration: 2000,
      });
    }
    closeModal();
  };

  return {
    isOpen,
    mode,
    currentExperience,
    openAddModal,
    openEditModal,
    closeModal,
    handleSubmit,
  };
}
