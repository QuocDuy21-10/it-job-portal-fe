"use client";

import { Plus, Edit, Trash2 } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CVFormSection from "@/components/sections/cv-form-section";
import LanguageModal from "@/components/cv/modals/language-modal";
import { useLanguageModal } from "@/hooks/use-language-modal";
import { toast } from "sonner";

interface Language {
  id: string;
  name: string;
  proficiency: string;
}

interface LanguagesSectionProps {
  languages: Language[];
  onAdd: (language: Language) => void;
  onUpdate: (id: string, field: string, value: string) => void;
  onRemove: (id: string) => void;
}

const PROFICIENCY_COLORS: Record<string, string> = {
  Beginner: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Intermediate: "bg-green-500/10 text-green-600 dark:text-green-400",
  Advanced: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  Native: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
};

export default function LanguagesSection({
  languages,
  onAdd,
  onUpdate,
  onRemove,
}: LanguagesSectionProps) {
  const { t } = useI18n();
  const languageModal = useLanguageModal(languages, onAdd, onUpdate);

  const handleRemove = (id: string, name: string) => {
    toast.success(t("cv.languages.deleteSuccess"), {
      description: t("cv.languages.deleteSuccessDesc", { name }),
      duration: 2000,
    });
    onRemove(id);
  };

  return (
    <>
      <CVFormSection
        title={t("cv.languages.title")}
        description={`${t("cv.languages.description")} (${languages.length}/5)`}
        actionButton={
          languages.length < 5 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={languageModal.openAddModal}
                    className="gap-2 bg-primary hover:bg-primary/90"
                  >
                    <Plus className="w-4 h-4" />
                    {t("cv.languages.addButton")}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("cv.languages.addTooltip")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        }
      >
        {languages.length === 0 ? (
          <div className="py-8 text-center rounded-xl border border-dashed border-border bg-secondary/10">
            <p className="text-sm text-muted-foreground">
              {t("cv.languages.noData")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {languages.map((lang) => (
              <Card
                key={lang.id}
                className="group relative overflow-hidden bg-gradient-to-br from-card to-secondary/20 border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-base text-foreground mb-2 line-clamp-1">
                        {lang.name}
                      </h4>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          PROFICIENCY_COLORS[lang.proficiency] || PROFICIENCY_COLORS.Intermediate
                        }`}
                      >
                        {lang.proficiency}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-border/30">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => languageModal.openEditModal(lang)}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium transition-all hover:scale-105"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            {t("cv.languages.edit")}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t("cv.languages.editTooltip")}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => handleRemove(lang.id, lang.name)}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-destructive/10 hover:bg-destructive/20 text-destructive text-xs font-medium transition-all hover:scale-105"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            {t("cv.languages.delete")}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t("cv.languages.deleteTooltip")}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CVFormSection>

      <LanguageModal
        isOpen={languageModal.isOpen}
        onClose={languageModal.closeModal}
        onSubmit={languageModal.handleSubmit}
        initialData={languageModal.currentLanguage}
        mode={languageModal.mode}
      />
    </>
  );
}
