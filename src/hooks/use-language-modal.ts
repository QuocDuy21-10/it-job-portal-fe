import { useState } from "react";
import { toast } from "sonner";
import { LanguageRequest } from "@/features/cv-profile/schemas/cv-profile.schema";
import { useI18n } from "@/hooks/use-i18n";

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
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [currentLanguage, setCurrentLanguage] = useState<Language | undefined>(undefined);

  const openAddModal = () => {
    if (languages.length >= 5) {
      toast.error(t("cv.toasts.languageLimitError"), {
        description: t("cv.toasts.languageLimitDesc"),
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
      toast.success(t("cv.toasts.languageAddSuccess"), {
        description: t("cv.toasts.languageAdded", { name: data.name }),
        duration: 2000,
      });
    } else if (mode === "edit" && currentLanguage) {
      onUpdate(currentLanguage.id, "name", data.name);
      onUpdate(currentLanguage.id, "proficiency", data.proficiency);
      toast.success(t("cv.toasts.languageEditSuccess"), {
        description: t("cv.toasts.languageUpdated", { name: data.name }),
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
