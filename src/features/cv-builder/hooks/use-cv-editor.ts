import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCV } from "@/features/cv-builder/hooks/use-cv";
import { UpsertCVProfileRequestSchema } from "@/features/cv-builder/schemas/cv-profile.schema";
import { calculateCVCompletion } from "@/features/cv-builder/utils/cv-helpers";
import {
  initialCVData,
  normalizeCVProfile,
  toUpsertCVProfileRequest,
} from "@/features/cv-builder/utils/cv-profile-mapper";
import { useI18n } from "@/hooks/use-i18n";
import type { CVData } from "@/shared/types/cv";

export type CVListSection =
  | "education"
  | "experience"
  | "skills"
  | "languages"
  | "projects"
  | "certificates"
  | "awards";

export interface CvEditor {
  cvData: CVData;
  completion: number;
  isInitialLoading: boolean;
  isSaving: boolean;
  setAvatarFile: (file: File | undefined) => void;
  updatePersonalInfo: (field: string, value: unknown) => void;
  addItem: <K extends CVListSection>(
    section: K,
    item: CVData[K][number]
  ) => void;
  updateItem: (
    section: CVListSection,
    id: string,
    field: string,
    value: unknown
  ) => void;
  removeItem: (section: CVListSection, id: string) => void;
  save: () => Promise<void>;
}

export function useCvEditor(): CvEditor {
  const { t } = useI18n();
  const [cvData, setCVData] = useState<CVData>(initialCVData);
  const completion = calculateCVCompletion(cvData);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState<File | undefined>(undefined);

  const { isLoading, error, upsertCV, fetchMyCVProfile, clearError } = useCV();

  useEffect(() => {
    const loadCVData = async () => {
      setIsInitialLoading(true);
      const result = await fetchMyCVProfile();

      setCVData(result ? normalizeCVProfile(result) : { ...initialCVData });
      setIsInitialLoading(false);
    };

    loadCVData();
  }, [fetchMyCVProfile]);

  useEffect(() => {
    if (error) {
      toast.error(t("cvPage.genericError"), {
        description: error,
      });
      clearError();
    }
  }, [error, clearError, t]);

  const save = async () => {
    try {
      clearError();

      const dataToValidate = toUpsertCVProfileRequest(cvData);

      // Manual validation using Zod
      const zodValidation =
        UpsertCVProfileRequestSchema.safeParse(dataToValidate);

      if (!zodValidation.success) {
        const firstError = zodValidation.error.issues[0];
        toast.error(t("cvPage.validationError"), {
          description: `${firstError.path.join(".")}: ${firstError.message}`,
          duration: 4000,
        });
        return;
      }

      const result = await upsertCV(dataToValidate, avatarFile);

      if (result) {
        toast.success(t("cvPage.saveSuccess"));

        // Clear avatar file after successful save
        setAvatarFile(undefined);

        const refreshedProfile = await fetchMyCVProfile();

        setCVData(normalizeCVProfile(refreshedProfile || result));
      }
    } catch (err) {
      console.error("Update CV failed:", err);
    }
  };

  const updatePersonalInfo = (field: string, value: unknown) =>
    setCVData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));

  const addItem = <K extends CVListSection>(
    section: K,
    item: CVData[K][number]
  ) =>
    setCVData(
      (prev) =>
        ({
          ...prev,
          [section]: [...prev[section], item],
        }) as CVData
    );

  const updateItem = (
    section: CVListSection,
    id: string,
    field: string,
    value: unknown
  ) =>
    setCVData(
      (prev) =>
        ({
          ...prev,
          [section]: (prev[section] as Array<{ id: string }>).map((item) =>
            item.id === id ? { ...item, [field]: value } : item
          ),
        }) as CVData
    );

  const removeItem = (section: CVListSection, id: string) =>
    setCVData(
      (prev) =>
        ({
          ...prev,
          [section]: (prev[section] as Array<{ id: string }>).filter(
            (item) => item.id !== id
          ),
        }) as CVData
    );

  return {
    cvData,
    completion,
    isInitialLoading,
    isSaving: isLoading,
    setAvatarFile,
    updatePersonalInfo,
    addItem,
    updateItem,
    removeItem,
    save,
  };
}
