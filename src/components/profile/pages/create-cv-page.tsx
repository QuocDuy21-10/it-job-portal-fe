"use client";

import { useState, useEffect } from "react";
import { Loader2, FileText, CheckCircle2, AlertCircle, Save, Download } from 'lucide-react';
import { useCV } from "@/hooks/use-cv";
import { useRouter } from "next/navigation";
import { calculateCVCompletion } from "@/lib/utils/cv-helpers";
import { 
  UpsertCVProfileRequestSchema,
  type CVProfile,
  type UpsertCVProfileRequest,
} from "@/features/cv-profile/schemas/cv-profile.schema";
import { toast } from "sonner";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

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
import { CVData } from "@/shared/types/cv";

const initialCVData: CVData = {
  personalInfo: {
    avatar: "",
    title: "",
    fullName: "",
    phone: "",
    email: "",
    birthday: undefined,
    gender: "male",
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

const createLocalId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const toDate = (value?: Date | string) => {
  if (!value) return undefined;
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? undefined : value;
  }
  const d = new Date(value);
  return isNaN(d.getTime()) ? undefined : d;
};

const safeToISOString = (date?: Date | string): string | undefined => {
  if (!date) return undefined;
  if (typeof date === "string") return date;
  if (date instanceof Date) {
    return isNaN(date.getTime()) ? undefined : date.toISOString();
  }
  return undefined;
};

const normalizeGender = (
  gender?: CVProfile["personalInfo"]["gender"]
): "male" | "female" | "other" | undefined => {
  if (gender === "male" || gender === "female" || gender === "other") {
    return gender;
  }

  return undefined;
};

const normalizeCVProfile = (profile: CVProfile): CVData => ({
  _id: profile._id,
  userId: profile.userId,
  personalInfo: {
    avatar: profile.personalInfo?.avatar || "",
    title: profile.personalInfo?.title || "",
    fullName: profile.personalInfo?.fullName || "",
    phone: profile.personalInfo?.phone || "",
    email: profile.personalInfo?.email || "",
    birthday: toDate(profile.personalInfo?.birthday),
    gender: normalizeGender(profile.personalInfo?.gender),
    address: profile.personalInfo?.address || "",
    personalLink: profile.personalInfo?.personalLink || "",
    bio: profile.personalInfo?.bio || "",
  },
  education: (profile.education || []).map((edu: any) => ({
    id: edu.id || createLocalId(),
    school: edu.school,
    degree: edu.degree,
    field: edu.field,
    startDate: toDate(edu.startDate) || edu.startDate,
    endDate: toDate(edu.endDate),
    description: edu.description || "",
  })),
  experience: (profile.experience || []).map((exp: any) => ({
    id: exp.id || createLocalId(),
    company: exp.company,
    position: exp.position,
    startDate: toDate(exp.startDate) || exp.startDate,
    endDate: toDate(exp.endDate) ,
    description: exp.description || "",
  })),
  skills: (profile.skills || []).map((skill: any) => ({
    id: skill.id || createLocalId(),
    name: skill.name,
    level: skill.level,
  })),
  languages: (profile.languages || []).map((lang: any) => ({
    id: lang.id || createLocalId(),
    name: lang.name,
    proficiency: lang.proficiency,
  })),
  projects: (profile.projects || []).map((proj: any) => ({
    id: proj.id || createLocalId(),
    name: proj.name,
    position: proj.position || "",
    description: proj.description,
    link: proj.link || "",
  })),
  certificates: (profile.certificates || []).map((cert: any) => ({
    id: cert.id || createLocalId(),
    name: cert.name,
    issuer: cert.issuer,
    date: toDate(cert.date) || cert.date,
  })),
  awards: (profile.awards || []).map((award: any) => ({
    id: award.id || createLocalId(),
    name: award.name,
    date: toDate(award.date) || award.date,
    description: award.description || "",
  })),
  isActive: profile.isActive,
  isDraft: profile.isDraft,
  lastUpdated: profile.lastUpdated || profile.updatedAt,
  createdAt: profile.createdAt,
  updatedAt: profile.updatedAt,
});

export default function CreateCVPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [cvData, setCVData] = useState<CVData>(initialCVData);
  const completion = calculateCVCompletion(cvData);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState<File | undefined>(undefined); // Store avatar file

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

  const handleUpdateCV = async () => {
    try {
      clearError();

      // Prepare data for validation
      const dataToValidate: UpsertCVProfileRequest = {
        personalInfo: {
          avatar: cvData.personalInfo.avatar || undefined,
          title: cvData.personalInfo.title || undefined,
          fullName: cvData.personalInfo.fullName,
          phone: cvData.personalInfo.phone,
          email: cvData.personalInfo.email,
          birthday: cvData.personalInfo.birthday || undefined,
          gender: cvData.personalInfo.gender || "male",
          address: cvData.personalInfo.address || undefined,
          personalLink: cvData.personalInfo.personalLink || undefined,
          bio: cvData.personalInfo.bio || undefined,
        },
        education: (cvData.education || []).map(edu => ({
          id: edu.id, // Include id for upsert
          school: edu.school,
          degree: edu.degree,
          field: edu.field,
          startDate: safeToISOString(edu.startDate) || "",
          endDate: safeToISOString(edu.endDate),
          description: edu.description || undefined,
        })),
        experience: (cvData.experience || []).map(exp => ({
          id: exp.id, // Include id for upsert
          company: exp.company,
          position: exp.position,
          startDate: safeToISOString(exp.startDate) || "",
          endDate: safeToISOString(exp.endDate),
          description: exp.description || undefined,
        })),
        skills: (cvData.skills || []).map(skill => ({
          id: skill.id, // Include id for upsert
          name: skill.name,
          level: skill.level,
        })),
        languages: (cvData.languages || []).map(lang => ({
          id: lang.id, // Include id for upsert
          name: lang.name,
          proficiency: lang.proficiency,
        })),
        projects: (cvData.projects || []).map(proj => ({
          id: proj.id, // Include id for upsert
          name: proj.name,
          position: proj.position,
          description: proj.description,
          link: proj.link || undefined,
        })),
        certificates: (cvData.certificates || []).map(cert => ({
          id: cert.id, // Include id for upsert
          name: cert.name,
          issuer: cert.issuer,
          date: safeToISOString(cert.date) || "",
        })),
        awards: (cvData.awards || []).map(award => ({
          id: award.id, // Include id for upsert
          name: award.name,
          date: safeToISOString(award.date) || "",
          description: award.description || undefined,
        })),
      };

      // Manual validation using Zod
      const zodValidation = UpsertCVProfileRequestSchema.safeParse(dataToValidate);
      
      if (!zodValidation.success) {
        const firstError = zodValidation.error.issues[0];
        toast.error(t("cvPage.validationError"), {
          description: `${firstError.path.join('.')}: ${firstError.message}`,
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

  useEffect(() => {
    if (error) {
      toast.error(t("cvPage.genericError"), {
        description: error,
      });
      clearError();
    }
  }, [error, clearError, t]);

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
            <p className="text-lg text-muted-foreground">{t("cvPage.loading")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Mobile Completion Progress Card */}
              <div className="block lg:hidden bg-white dark:bg-card p-5 rounded-lg border border-border shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-foreground">Hồ sơ của tôi</h2>
                  <span className="text-primary font-bold text-sm">{completion}%</span>
                </div>
                <div className="w-full bg-secondary/35 h-2.5 rounded-full mb-6 overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${completion}%` }}
                  ></div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Kinh nghiệm", completed: cvData.experience.length > 0 },
                    { label: "Học vấn", completed: cvData.education.length > 0 },
                    { label: "Kỹ năng", completed: cvData.skills.length > 0 },
                    { label: "Ngôn ngữ", completed: cvData.languages.length > 0 },
                    { label: "Thông tin cá nhân", completed: !!(cvData.personalInfo.fullName && cvData.personalInfo.email) },
                  ].map((item, idx) => (
                    <span
                      key={idx}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all duration-300",
                        item.completed 
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" 
                          : "bg-destructive/10 text-destructive dark:text-red-400 border-destructive/20"
                      )}
                    >
                      {item.completed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-destructive" />
                      )}
                      {item.label}
                    </span>
                  ))}
                </div>
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
                onAvatarChange={(file) => setAvatarFile(file)}
                isEmailReadOnly
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

            {/* Sidebar - Completion Progress - Desktop sticky, Mobile floating */}
            <div className="lg:col-span-1">
              {/* Desktop Sticky Sidebar */}
              <aside className="hidden lg:block sticky top-24 self-start max-h-[calc(100vh-6rem)] overflow-y-auto no-scrollbar">
                <CompletionProgress 
                  cvData={cvData}
                  onSave={handleUpdateCV}
                  isSaving={isLoading}
                />
              </aside>

              {/* Mobile/Tablet Sticky Action Bar */}
              <div className="lg:hidden fixed bottom-16 left-0 right-0 bg-white dark:bg-card border-t border-gray-200 dark:border-border p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-40 flex flex-col gap-2">
                <button
                  onClick={handleUpdateCV}
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-3 rounded-lg text-sm transition-transform active:scale-[0.98] flex justify-center items-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Lưu CV
                </button>
                <button
                  onClick={() => router.push("/profile/cv-preview")}
                  disabled={completion < 15}
                  className="w-full border border-gray-200 dark:border-border text-gray-700 dark:text-gray-300 py-3 rounded-lg font-bold text-sm flex justify-center items-center gap-2 active:bg-secondary/20 transition-colors disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  Xem trước &amp; Tải PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
