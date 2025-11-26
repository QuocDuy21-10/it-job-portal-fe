import { useState } from "react";
import { toast } from "sonner";
import { SkillRequest } from "@/features/cv-profile/schemas/cv-profile.schema";

interface Skill extends SkillRequest {
  id: string;
}

interface UseSkillModalReturn {
  isOpen: boolean;
  mode: "add" | "edit";
  currentSkill: (Skill & { id?: string }) | undefined;
  openAddModal: () => void;
  openEditModal: (skill: Skill) => void;
  closeModal: () => void;
  handleSubmit: (data: SkillRequest) => void;
}

export function useSkillModal(
  skills: Skill[],
  onAdd: (skill: Skill) => void,
  onUpdate: (id: string, field: string, value: string) => void
): UseSkillModalReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [currentSkill, setCurrentSkill] = useState<Skill | undefined>(undefined);

  const openAddModal = () => {
    if (skills.length >= 20) {
      toast.error("Giới hạn kỹ năng", {
        description: "Bạn chỉ có thể thêm tối đa 20 kỹ năng",
        duration: 3000,
      });
      return;
    }
    setMode("add");
    setCurrentSkill(undefined);
    setIsOpen(true);
  };

  const openEditModal = (skill: Skill) => {
    setMode("edit");
    setCurrentSkill(skill);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setCurrentSkill(undefined);
  };

  const handleSubmit = (data: SkillRequest) => {
    if (mode === "add") {
      const newSkill: Skill = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...data,
      };
      onAdd(newSkill);
      toast.success("Thêm kỹ năng thành công", {
        description: `Đã thêm kỹ năng: ${data.name}`,
        duration: 2000,
      });
    } else if (mode === "edit" && currentSkill) {
      onUpdate(currentSkill.id, "name", data.name);
      onUpdate(currentSkill.id, "level", data.level);
      toast.success("Cập nhật kỹ năng thành công", {
        description: `Đã cập nhật: ${data.name}`,
        duration: 2000,
      });
    }
    closeModal();
  };

  return {
    isOpen,
    mode,
    currentSkill,
    openAddModal,
    openEditModal,
    closeModal,
    handleSubmit,
  };
}
