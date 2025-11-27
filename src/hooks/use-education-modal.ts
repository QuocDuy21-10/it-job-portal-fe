import { useState } from "react";
import { toast } from "sonner";
import { EducationRequest } from "@/features/cv-profile/schemas/cv-profile.schema";

interface Education extends EducationRequest {
  id: string;
}

interface UseEducationModalReturn {
  isOpen: boolean;
  mode: "add" | "edit";
  currentEducation: (Education & { id?: string }) | undefined;
  openAddModal: () => void;
  openEditModal: (education: Education) => void;
  closeModal: () => void;
  handleSubmit: (data: EducationRequest) => void;
}

export function useEducationModal(
  educations: Education[],
  onAdd: (education: Education) => void,
  onUpdate: (id: string, field: string, value: string) => void
): UseEducationModalReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [currentEducation, setCurrentEducation] = useState<Education | undefined>(undefined);

  const openAddModal = () => {
    setMode("add");
    setCurrentEducation(undefined);
    setIsOpen(true);
  };

  const openEditModal = (education: Education) => {
    setMode("edit");
    setCurrentEducation(education);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setCurrentEducation(undefined);
  };

  const handleSubmit = (data: EducationRequest) => {
    if (mode === "add") {
      const newEducation: Education = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...data,
      };
      onAdd(newEducation);
      toast.success("Thêm học vấn thành công", {
        description: `Đã thêm: ${data.school} - ${data.degree}`,
        duration: 2000,
      });
    } else if (mode === "edit" && currentEducation) {
      onUpdate(currentEducation.id, "school", data.school);
      onUpdate(currentEducation.id, "degree", data.degree);
      onUpdate(currentEducation.id, "field", data.field);
      onUpdate(currentEducation.id, "startDate", data.startDate);
      onUpdate(currentEducation.id, "endDate", data.endDate || "");
      onUpdate(currentEducation.id, "description", data.description || "");
      toast.success("Cập nhật học vấn thành công", {
        description: `Đã cập nhật: ${data.school}`,
        duration: 2000,
      });
    }
    closeModal();
  };

  return {
    isOpen,
    mode,
    currentEducation,
    openAddModal,
    openEditModal,
    closeModal,
    handleSubmit,
  };
}
