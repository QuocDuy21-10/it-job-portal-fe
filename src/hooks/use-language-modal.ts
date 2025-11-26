import { useState } from "react";
import { toast } from "sonner";
import { LanguageRequest } from "@/features/cv-profile/schemas/cv-profile.schema";

interface Language extends LanguageRequest {
  id: string;
}

interface UseLanguageModalReturn {
  isOpen: boolean;
  mode: "add" | "edit";
  currentLanguage: (Language & { id?: string }) | undefined;
  openAddModal: () => void;
  openEditModal: (language: Language) => void;
  closeModal: () => void;
  handleSubmit: (data: LanguageRequest) => void;
}

export function useLanguageModal(
  languages: Language[],
  onAdd: (language: Language) => void,
  onUpdate: (id: string, field: string, value: string) => void
): UseLanguageModalReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [currentLanguage, setCurrentLanguage] = useState<Language | undefined>(undefined);

  const openAddModal = () => {
    if (languages.length >= 5) {
      toast.error("Giới hạn ngôn ngữ", {
        description: "Bạn chỉ có thể thêm tối đa 5 ngôn ngữ",
        duration: 3000,
      });
      return;
    }
    setMode("add");
    setCurrentLanguage(undefined);
    setIsOpen(true);
  };

  const openEditModal = (language: Language) => {
    setMode("edit");
    setCurrentLanguage(language);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setCurrentLanguage(undefined);
  };

  const handleSubmit = (data: LanguageRequest) => {
    if (mode === "add") {
      const newLanguage: Language = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...data,
      };
      onAdd(newLanguage);
      toast.success("Thêm ngôn ngữ thành công", {
        description: `Đã thêm: ${data.name}`,
        duration: 2000,
      });
    } else if (mode === "edit" && currentLanguage) {
      onUpdate(currentLanguage.id, "name", data.name);
      onUpdate(currentLanguage.id, "proficiency", data.proficiency);
      toast.success("Cập nhật ngôn ngữ thành công", {
        description: `Đã cập nhật: ${data.name}`,
        duration: 2000,
      });
    }
    closeModal();
  };

  return {
    isOpen,
    mode,
    currentLanguage,
    openAddModal,
    openEditModal,
    closeModal,
    handleSubmit,
  };
}
