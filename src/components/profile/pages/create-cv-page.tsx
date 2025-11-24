"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Loader2, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useCV } from "@/hooks/use-cv";
import { 
  UpsertCVProfileRequestSchema,
  type UpsertCVProfileRequest,
  type PersonalInfo,
  type Education,
  type Experience,
  type Skill,
  type Language,
  type Project,
  type Certificate,
  type Award,
} from "@/features/cv-profile/schemas/cv-profile.schema";
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

interface CVData {
  _id?: string;
  userId?: string;
  personalInfo: {
    fullName: string;
    phone: string;
    email: string;
    birthday?: Date;
    gender?: "male" | "female" | "other";
    address?: string;
    personalLink?: string;
    bio?: string;
  };
  education: Array<{
    id: string;
    school: string;
    degree: string;
    field: string;
    startDate: Date | string;
    endDate?: Date | string;
    description?: string;
  }>;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: Date | string;
    endDate?: Date | string;
    description?: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
    level: string;
  }>;
  languages: Array<{
    id: string;
    name: string;
    proficiency: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    link?: string;
  }>;
  certificates: Array<{
    id: string;
    name: string;
    issuer: string;
    date: Date | string;
  }>;
  awards: Array<{
    id: string;
    name: string;
    date: Date | string;
    description?: string;
  }>;
  isActive?: boolean;
  lastUpdated?: string;
  createdAt?: string;
  updatedAt?: string;
}

const initialCVData: CVData = {
  personalInfo: {
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

export default function CreateCVPage() {
  const [cvData, setCVData] = useState<CVData>(initialCVData);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const { isLoading, error, upsertCV, fetchMyCVProfile, clearError } = useCV();

  // React Hook Form with Zod validation
  const {
    formState: { errors: formErrors },
    trigger,
    clearErrors,
  } = useForm({
    resolver: zodResolver(UpsertCVProfileRequestSchema) as any,
    mode: "onChange",
  });

  useEffect(() => {
    const loadCVData = async () => {
      setIsInitialLoading(true);
      const result = await fetchMyCVProfile();

      if (result) {
        setCVData({
          _id: result._id,
          userId: result.userId,
          personalInfo: {
            fullName: result.personalInfo?.fullName,
            phone: result.personalInfo?.phone,
            email: result.personalInfo?.email,
            birthday: result.personalInfo?.birthday ? new Date(result.personalInfo.birthday) : undefined,
            gender: result.personalInfo?.gender as "male" | "female" | "other" | undefined,
            address: result.personalInfo?.address || "",
            personalLink: result.personalInfo?.personalLink || "",
            bio: result.personalInfo?.bio || "",
          },
          education: result.education.map((edu: any) => ({
            id: edu.id || "",
            school: edu.school,
            degree: edu.degree,
            field: edu.field,
            startDate: new Date(edu.startDate),
            endDate: edu.endDate ? new Date(edu.endDate) : undefined,
            description: edu.description || "",
          })),
          experience: result.experience.map((exp: any) => ({
            id: exp.id || "",
            company: exp.company,
            position: exp.position,
            startDate: new Date(exp.startDate),
            endDate: new Date(exp.endDate),
            description: exp.description || "",
          })),
          skills: result.skills.map((skill: any) => ({
            id: skill.id || "",
            name: skill.name,
            level: skill.level,
          })),
          languages: result.languages.map((lang: any) => ({
            id: lang.id || "",
            name: lang.name,
            proficiency: lang.proficiency,
          })),
          projects: result.projects.map((proj: any) => ({
            id: proj.id || "",
            name: proj.name,
            description: proj.description,
            link: proj.link || "",
          })),
          certificates: result.certificates.map((cert: any) => ({
            id: cert.id || "",
            name: cert.name,
            issuer: cert.issuer,
            date: new Date(cert.date),
          })),
          awards: result.awards.map((award: any) => ({
            id: award.id || "",
            name: award.name,
            date: new Date(award.date),
            description: award.description || "",
          })),
          isActive: result.isActive,
          lastUpdated: result.updatedAt,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
        });
      } else {
        setCVData(initialCVData);
      }

      setIsInitialLoading(false);
    };

    loadCVData();
  }, []);

  const handleUpdateCV = async () => {
    try {
      clearError();
      clearErrors();

      // Prepare data for validation
      const dataToValidate: UpsertCVProfileRequest = {
        personalInfo: {
          fullName: cvData.personalInfo.fullName,
          phone: cvData.personalInfo.phone,
          email: cvData.personalInfo.email,
          birthday: cvData.personalInfo.birthday || undefined,
          gender: cvData.personalInfo.gender || "male",
          address: cvData.personalInfo.address || undefined,
          personalLink: cvData.personalInfo.personalLink || undefined,
          bio: cvData.personalInfo.bio || undefined,
        },
        education: cvData.education.map(edu => ({
          school: edu.school,
          degree: edu.degree,
          field: edu.field,
          startDate: typeof edu.startDate === 'string' ? edu.startDate : edu.startDate.toISOString(),
          endDate: edu.endDate ? (typeof edu.endDate === 'string' ? edu.endDate : edu.endDate.toISOString()) : undefined,
          description: edu.description || undefined,
        })),
        experience: cvData.experience.map(exp => ({
          company: exp.company,
          position: exp.position,
          startDate: typeof exp.startDate === 'string' ? exp.startDate : exp.startDate.toISOString(),
          endDate: exp.endDate ? (typeof exp.endDate === 'string' ? exp.endDate : exp.endDate.toISOString()) : undefined,
          description: exp.description || undefined,
        })),
        skills: cvData.skills.map(skill => ({
          name: skill.name,
          level: skill.level,
        })),
        languages: cvData.languages.map(lang => ({
          name: lang.name,
          proficiency: lang.proficiency,
        })),
        projects: cvData.projects.map(proj => ({
          name: proj.name,
          description: proj.description,
          link: proj.link || undefined,
        })),
        certificates: cvData.certificates.map(cert => ({
          name: cert.name,
          issuer: cert.issuer,
          date: typeof cert.date === 'string' ? cert.date : cert.date.toISOString(),
        })),
        awards: cvData.awards.map(award => ({
          name: award.name,
          date: typeof award.date === 'string' ? award.date : award.date.toISOString(),
          description: award.description || undefined,
        })),
      };

      // Validate the form data
      const validationResult = await trigger();
      
      // Manual validation using Zod
      const zodValidation = UpsertCVProfileRequestSchema.safeParse(dataToValidate);
      
      if (!zodValidation.success) {
        const firstError = zodValidation.error.issues[0];
        toast.error("Lỗi Validation", {
          description: `${firstError.path.join('.')}: ${firstError.message}`,
          duration: 4000,
        });
        return;
      }

      const result = await upsertCV(dataToValidate);

      if (result) {
        toast.success("Lưu CV thành công!", {
          description: "CV của bạn đã được lưu.",
          duration: 3000,
        });
        
        // Convert API response back to ICVProfile format
        setCVData({
          _id: result._id,
          userId: result.userId,
          personalInfo: {
            fullName: result.personalInfo.fullName,
            phone: result.personalInfo.phone,
            email: result.personalInfo.email,
            birthday: result.personalInfo.birthday ? new Date(result.personalInfo.birthday) : undefined,
            gender: result.personalInfo.gender as "male" | "female" | "other" | undefined,
            address: result.personalInfo.address || "",
            personalLink: result.personalInfo.personalLink || "",
            bio: result.personalInfo.bio || "",
          },
          education: result.education.map((edu: any) => ({
            id: edu.id || "",
            school: edu.school,
            degree: edu.degree,
            field: edu.field,
            startDate: edu.startDate,
            endDate: edu.endDate || "",
            description: edu.description || "",
          })),
          experience: result.experience.map((exp: any) => ({
            id: exp.id || "",
            company: exp.company,
            position: exp.position,
            startDate: exp.startDate,
            endDate: exp.endDate || "",
            description: exp.description || "",
          })),
          skills: result.skills.map((skill: any) => ({
            id: skill.id || "",
            name: skill.name,
            level: skill.level,
          })),
          languages: result.languages.map((lang: any) => ({
            id: lang.id || "",
            name: lang.name,
            proficiency: lang.proficiency,
          })),
          projects: result.projects.map((proj: any) => ({
            id: proj.id || "",
            name: proj.name,
            description: proj.description,
            link: proj.link || "",
          })),
          certificates: result.certificates.map((cert: any) => ({
            id: cert.id || "",
            name: cert.name,
            issuer: cert.issuer,
            date: cert.date,
          })),
          awards: result.awards.map((award: any) => ({
            id: award.id || "",
            name: award.name,
            date: award.date,
            description: award.description || "",
          })),
          isActive: result.isActive,
          lastUpdated: result.updatedAt,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
        });
      }
    } catch (err) {
      console.error("Update CV failed:", err);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error("Có lỗi xảy ra", {
        description: error,
        duration: 4000,
      });
      clearError();
    }
  }, [error, clearError]);

  // Validation summary helper
  const getValidationErrors = () => {
    const dataToValidate: UpsertCVProfileRequest = {
      personalInfo: {
        fullName: cvData.personalInfo.fullName,
        phone: cvData.personalInfo.phone,
        email: cvData.personalInfo.email,
        birthday: cvData.personalInfo.birthday || undefined,
        gender: cvData.personalInfo.gender || "male",
        address: cvData.personalInfo.address || undefined,
        personalLink: cvData.personalInfo.personalLink || undefined,
        bio: cvData.personalInfo.bio || undefined,
      },
      education: cvData.education.map(edu => ({
        school: edu.school,
        degree: edu.degree,
        field: edu.field,
        startDate: typeof edu.startDate === 'string' ? edu.startDate : edu.startDate.toISOString(),
        endDate: edu.endDate ? (typeof edu.endDate === 'string' ? edu.endDate : edu.endDate.toISOString()) : undefined,
        description: edu.description || undefined,
      })),
      experience: cvData.experience.map(exp => ({
        company: exp.company,
        position: exp.position,
        startDate: typeof exp.startDate === 'string' ? exp.startDate : exp.startDate.toISOString(),
        endDate: exp.endDate ? (typeof exp.endDate === 'string' ? exp.endDate : exp.endDate.toISOString()) : undefined,
        description: exp.description || undefined,
      })),
      skills: cvData.skills.map(skill => ({
        name: skill.name,
        level: skill.level,
      })),
      languages: cvData.languages.map(lang => ({
        name: lang.name,
        proficiency: lang.proficiency,
      })),
      projects: cvData.projects.map(proj => ({
        name: proj.name,
        description: proj.description,
        link: proj.link || undefined,
      })),
      certificates: cvData.certificates.map(cert => ({
        name: cert.name,
        issuer: cert.issuer,
        date: typeof cert.date === 'string' ? cert.date : cert.date.toISOString(),
      })),
      awards: cvData.awards.map(award => ({
        name: award.name,
        date: typeof award.date === 'string' ? award.date : award.date.toISOString(),
        description: award.description || undefined,
      })),
    };

    const result = UpsertCVProfileRequestSchema.safeParse(dataToValidate);
    return result.success ? [] : result.error.issues;
  };

  const validationErrors = getValidationErrors();

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
              {/* Validation Errors Summary */}
              {validationErrors.length > 0 && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-destructive mb-2">
                        Vui lòng sửa các lỗi sau ({validationErrors.length})
                      </h3>
                      <ul className="space-y-1 text-sm text-destructive/90">
                        {validationErrors.slice(0, 5).map((error, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-destructive">•</span>
                            <span>
                              {error.path.join(' → ')}: {error.message}
                            </span>
                          </li>
                        ))}
                        {validationErrors.length > 5 && (
                          <li className="text-xs text-muted-foreground italic mt-2">
                            ... và {validationErrors.length - 5} lỗi khác
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 flex-wrap">
                <Button
                  onClick={handleUpdateCV}
                  disabled={isLoading || validationErrors.length > 0}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Lưu CV {validationErrors.length > 0 && `(${validationErrors.length} lỗi)`}
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
    </div>
  );
}
