"use client";

import { FileText, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import CompletionProgress from "@/features/cv-builder/components/completion-progress";
import MobileCompletionCard from "@/features/cv-builder/components/create-cv-page/mobile-completion-card";
import MobileSaveBar from "@/features/cv-builder/components/create-cv-page/mobile-save-bar";
import AwardsSection from "@/features/cv-builder/components/sections/awards-section";
import CertificatesSection from "@/features/cv-builder/components/sections/certificates-section";
import EducationSection from "@/features/cv-builder/components/sections/education-section";
import LanguagesSection from "@/features/cv-builder/components/sections/languages-section";
import PersonalInfoSection from "@/features/cv-builder/components/sections/personal-info-section";
import ProjectsSection from "@/features/cv-builder/components/sections/projects-section";
import SkillsSection from "@/features/cv-builder/components/sections/skills-section";
import WorkExperienceSection from "@/features/cv-builder/components/sections/work-experience-section";
import { useCvEditor } from "@/features/cv-builder/hooks/use-cv-editor";
import { useI18n } from "@/hooks/use-i18n";

export default function CreateCVPage() {
  const { t } = useI18n();
  const router = useRouter();
  const {
    cvData,
    completion,
    isInitialLoading,
    isSaving,
    setAvatarFile,
    updatePersonalInfo,
    addItem,
    updateItem,
    removeItem,
    save,
  } = useCvEditor();

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-48 lg:pb-8">
        {/* Card Header */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 flex items-center gap-4 shadow-sm mb-6">
          <div className="p-3.5 rounded-xl bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
            <FileText className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t("cvPage.title")}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t("cvPage.description")}
            </p>
          </div>
        </div>
        {/* Initial Loading State */}
        {isInitialLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-lg text-muted-foreground">
              {t("cvPage.loading")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form Content */}
            <div className="lg:col-span-2 space-y-8">
              <MobileCompletionCard cvData={cvData} completion={completion} />

              {/* Form Sections */}
              <PersonalInfoSection
                personalInfo={cvData.personalInfo}
                onUpdate={updatePersonalInfo}
                onAvatarChange={(file) => setAvatarFile(file)}
                isEmailReadOnly
              />

              <EducationSection
                education={cvData.education as any}
                onAdd={(edu) => addItem("education", edu)}
                onUpdate={(id, field, value) =>
                  updateItem("education", id, field, value)
                }
                onRemove={(id) => removeItem("education", id)}
              />

              <WorkExperienceSection
                experience={cvData.experience as any}
                onAdd={(exp) => addItem("experience", exp)}
                onUpdate={(id, field, value) =>
                  updateItem("experience", id, field, value)
                }
                onRemove={(id) => removeItem("experience", id)}
              />

              <SkillsSection
                skills={cvData.skills as any}
                onAdd={(skill) => addItem("skills", skill)}
                onUpdate={(id, field, value) =>
                  updateItem("skills", id, field, value)
                }
                onRemove={(id) => removeItem("skills", id)}
              />

              <LanguagesSection
                languages={cvData.languages as any}
                onAdd={(lang) => addItem("languages", lang)}
                onUpdate={(id, field, value) =>
                  updateItem("languages", id, field, value)
                }
                onRemove={(id) => removeItem("languages", id)}
              />

              <ProjectsSection
                projects={cvData.projects as any}
                onAdd={(proj) => addItem("projects", proj)}
                onUpdate={(id, field, value) =>
                  updateItem("projects", id, field, value)
                }
                onRemove={(id) => removeItem("projects", id)}
              />

              <CertificatesSection
                certificates={cvData.certificates as any}
                onAdd={(cert) => addItem("certificates", cert)}
                onUpdate={(id, field, value) =>
                  updateItem("certificates", id, field, value)
                }
                onRemove={(id) => removeItem("certificates", id)}
              />

              <AwardsSection
                awards={cvData.awards as any}
                onAdd={(award) => addItem("awards", award)}
                onUpdate={(id, field, value) =>
                  updateItem("awards", id, field, value)
                }
                onRemove={(id) => removeItem("awards", id)}
              />
            </div>

            {/* Sidebar - Completion Progress - Desktop sticky, Mobile floating */}
            <div className="lg:col-span-1">
              {/* Desktop Sticky Sidebar */}
              <aside className="hidden lg:block sticky top-24 self-start max-h-[calc(100vh-6rem)] overflow-y-auto no-scrollbar">
                <CompletionProgress
                  cvData={cvData}
                  onSave={save}
                  isSaving={isSaving}
                />
              </aside>

              {/* Mobile/Tablet Sticky Action Bar */}
              <MobileSaveBar
                onSave={save}
                isSaving={isSaving}
                canPreview={completion >= 15}
                onPreview={() => router.push("/profile/cv-preview")}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
