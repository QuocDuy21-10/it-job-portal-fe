"use client";

import { useState, useEffect } from "react";
import { Download, Save, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import CVPreviewModal from "@/components/modals/cv-preview-modal";
import { useCV } from "@/hooks/use-cv";
import { ICVProfile } from "@/shared/types/cv";
import { toast } from "sonner";

// Section imports
import PersonalInfoSection from "@/components/cv/sections/personal-info-section";
import EducationSection from "@/components/cv/sections/education-section";
import WorkExperienceSection from "@/components/cv/sections/work-experience-section";
import SkillsSection from "@/components/cv/sections/skills-section";
import LanguagesSection from "@/components/cv/sections/languages-section";
import ProjectsSection from "@/components/cv/sections/projects-section";
import CertificatesSection from "@/components/cv/sections/certificates-section";
import AwardsSection from "@/components/cv/sections/awards-section";
import CompletionProgress from "@/components/cv/completion-progress";

const initialCVData: ICVProfile = {
  personalInfo: {
    fullName: "",
    phone: "",
    email: "",
    birthday: "",
    gender: "",
    address: "",
    personalLink: "",
    bio: "",
  },
  education: [],
  experience: [],
  skills: [],
  languages: [],
  projects: [],
  certificates: [],
  awards: [],
};

export default function CreateCVPage() {
  const [cvData, setCVData] = useState<ICVProfile>(initialCVData);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const { isLoading, error, upsertCV, fetchMyCVProfile, clearError } = useCV();

  useEffect(() => {
    const loadCVData = async () => {
      setIsInitialLoading(true);
      const result = await fetchMyCVProfile();

      if (result) {
        setCVData({
          personalInfo: result.personalInfo || initialCVData.personalInfo,
          education: result.education || [],
          experience: result.experience || [],
          skills: result.skills || [],
          languages: result.languages || [],
          projects: result.projects || [],
          certificates: result.certificates || [],
          awards: result.awards || [],
        });
      } else {
        setCVData(initialCVData);
      }

      setIsInitialLoading(false);
    };

    loadCVData();
  }, [fetchMyCVProfile]);

  const handleUpdateCV = async () => {
    try {
      clearError();
      const result = await upsertCV({
        personalInfo: cvData.personalInfo,
        education: cvData.education,
        experience: cvData.experience,
        skills: cvData.skills,
        languages: cvData.languages,
        projects: cvData.projects,
        certificates: cvData.certificates,
        awards: cvData.awards,
      });

      if (result) {
        toast.success("CV updated successfully!", {
          description: "Your CV has been saved.",
          duration: 3000,
        });
        setCVData(result);
      }
    } catch (err) {
      console.error("Update CV failed:", err);
    }
  };

  if (error) {
    toast.error("Failed to update CV", {
      description: error,
      duration: 4000,
    });
    clearError();
  }

  return (
    <div className="bg-background min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}

        {/* Initial Loading State */}
        {isInitialLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-lg text-muted-foreground">Loading your CV...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Action Buttons */}
              <div className="flex gap-3 flex-wrap">
                <Button
                  onClick={() => setIsPreviewOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Preview & Download
                </Button>
                <Button
                  onClick={handleUpdateCV}
                  disabled={isLoading}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save CV
                    </>
                  )}
                </Button>
              </div>

              {/* Form Sections */}
              <PersonalInfoSection
                personalInfo={cvData.personalInfo}
                onUpdate={(field, value) =>
                  setCVData((prev) => ({
                    ...prev,
                    personalInfo: {
                      ...prev.personalInfo,
                      [field]: value,
                    },
                  }))
                }
              />

              <EducationSection
                education={cvData.education as any}
                onAdd={(edu) =>
                  setCVData((prev) => ({
                    ...prev,
                    education: [...prev.education, edu],
                  }))
                }
                onUpdate={(id, field, value) =>
                  setCVData((prev) => ({
                    ...prev,
                    education: prev.education.map((edu: any) =>
                      edu.id === id ? { ...edu, [field]: value } : edu
                    ),
                  }))
                }
                onRemove={(id) =>
                  setCVData((prev) => ({
                    ...prev,
                    education: prev.education.filter((edu: any) => edu.id !== id),
                  }))
                }
              />

              <WorkExperienceSection
                experience={cvData.experience as any}
                onAdd={(exp) =>
                  setCVData((prev) => ({
                    ...prev,
                    experience: [...prev.experience, exp],
                  }))
                }
                onUpdate={(id, field, value) =>
                  setCVData((prev) => ({
                    ...prev,
                    experience: prev.experience.map((exp: any) =>
                      exp.id === id ? { ...exp, [field]: value } : exp
                    ),
                  }))
                }
                onRemove={(id) =>
                  setCVData((prev) => ({
                    ...prev,
                    experience: prev.experience.filter((exp: any) => exp.id !== id),
                  }))
                }
              />

              <SkillsSection
                skills={cvData.skills as any}
                onAdd={(skill) =>
                  setCVData((prev) => ({
                    ...prev,
                    skills: [...prev.skills, skill],
                  }))
                }
                onUpdate={(id, field, value) =>
                  setCVData((prev) => ({
                    ...prev,
                    skills: prev.skills.map((skill: any) =>
                      skill.id === id ? { ...skill, [field]: value } : skill
                    ),
                  }))
                }
                onRemove={(id) =>
                  setCVData((prev) => ({
                    ...prev,
                    skills: prev.skills.filter((skill: any) => skill.id !== id),
                  }))
                }
              />

              <LanguagesSection
                languages={cvData.languages as any}
                onAdd={(lang) =>
                  setCVData((prev) => ({
                    ...prev,
                    languages: [...prev.languages, lang],
                  }))
                }
                onUpdate={(id, field, value) =>
                  setCVData((prev) => ({
                    ...prev,
                    languages: prev.languages.map((lang: any) =>
                      lang.id === id ? { ...lang, [field]: value } : lang
                    ),
                  }))
                }
                onRemove={(id) =>
                  setCVData((prev) => ({
                    ...prev,
                    languages: prev.languages.filter((lang: any) => lang.id !== id),
                  }))
                }
              />

              <ProjectsSection
                projects={cvData.projects as any}
                onAdd={(project) =>
                  setCVData((prev) => ({
                    ...prev,
                    projects: [...prev.projects, project],
                  }))
                }
                onUpdate={(id, field, value) =>
                  setCVData((prev) => ({
                    ...prev,
                    projects: prev.projects.map((proj: any) =>
                      proj.id === id ? { ...proj, [field]: value } : proj
                    ),
                  }))
                }
                onRemove={(id) =>
                  setCVData((prev) => ({
                    ...prev,
                    projects: prev.projects.filter((proj: any) => proj.id !== id),
                  }))
                }
              />

              <CertificatesSection
                certificates={cvData.certificates as any}
                onAdd={(cert) =>
                  setCVData((prev) => ({
                    ...prev,
                    certificates: [...prev.certificates, cert],
                  }))
                }
                onUpdate={(id, field, value) =>
                  setCVData((prev) => ({
                    ...prev,
                    certificates: prev.certificates.map((cert: any) =>
                      cert.id === id ? { ...cert, [field]: value } : cert
                    ),
                  }))
                }
                onRemove={(id) =>
                  setCVData((prev) => ({
                    ...prev,
                    certificates: prev.certificates.filter((cert: any) => cert.id !== id),
                  }))
                }
              />

              <AwardsSection
                awards={cvData.awards as any}
                onAdd={(award) =>
                  setCVData((prev) => ({
                    ...prev,
                    awards: [...prev.awards, award],
                  }))
                }
                onUpdate={(id, field, value) =>
                  setCVData((prev) => ({
                    ...prev,
                    awards: prev.awards.map((award: any) =>
                      award.id === id ? { ...award, [field]: value } : award
                    ),
                  }))
                }
                onRemove={(id) =>
                  setCVData((prev) => ({
                    ...prev,
                    awards: prev.awards.filter((award: any) => award.id !== id),
                  }))
                }
              />
            </div>

            {/* Sidebar - Completion Progress */}
            <div className="lg:col-span-1">
              <CompletionProgress cvData={cvData} />
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <CVPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        cvData={cvData}
        selectedTemplate={selectedTemplate}
        onTemplateChange={setSelectedTemplate}
      />
    </div>
  );
}
