import { useState } from "react";
import { toast } from "sonner";
import { AwardRequest } from "@/features/cv-profile/schemas/cv-profile.schema";

interface Award extends AwardRequest {
  id: string;
}

interface UseAwardModalReturn {
  isOpen: boolean;
  mode: "add" | "edit";
  currentAward: (Award & { id?: string }) | undefined;
  openAddModal: () => void;
  openEditModal: (award: Award) => void;
  closeModal: () => void;
  handleSubmit: (data: AwardRequest) => void;
}

export function useAwardModal(
  awards: Award[],
  onAdd: (award: Award) => void,
  onUpdate: (id: string, field: string, value: string) => void
): UseAwardModalReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [currentAward, setCurrentAward] = useState<Award | undefined>(undefined);

  const openAddModal = () => {
    setMode("add");
    setCurrentAward(undefined);
    setIsOpen(true);
  };

  const openEditModal = (award: Award) => {
    setMode("edit");
    setCurrentAward(award);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setCurrentAward(undefined);
  };

  const handleSubmit = (data: AwardRequest) => {
    if (mode === "add") {
      const newAward: Award = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...data,
      };
      onAdd(newAward);
      toast.success("Thêm giải thưởng thành công", {
        description: `Đã thêm: ${data.name}`,
        duration: 2000,
      });
    } else if (mode === "edit" && currentAward) {
      onUpdate(currentAward.id, "name", data.name);
      onUpdate(currentAward.id, "date", data.date);
      onUpdate(currentAward.id, "description", data.description || "");
      toast.success("Cập nhật giải thưởng thành công", {
        description: `Đã cập nhật: ${data.name}`,
        duration: 2000,
      });
    }
    closeModal();
  };

  return {
    isOpen,
    mode,
    currentAward,
    openAddModal,
    openEditModal,
    closeModal,
    handleSubmit,
  };
}
