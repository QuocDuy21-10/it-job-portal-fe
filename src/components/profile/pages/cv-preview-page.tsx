"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ICVProfile } from "@/shared/types/cv";
import { useCV } from "@/hooks/use-cv";
import DownloadPDFButton from "@/components/pdf/download-pdf-button";
import PDFPreview from "@/components/pdf/pdf-preview";

/**
 * Helper function to display date
 * Empty string means "Present" (current position)
 */
const formatDateDisplay = (date: string | Date | undefined): string => {
  if (!date || (typeof date === "string" && date.trim() === "")) {
    return "Present";
  }
  if (date instanceof Date) {
    return date.toLocaleDateString("vi-VN", { month: "2-digit", year: "numeric" });
  }
  return date;
};

export default function CVPreviewPage() {
  const router = useRouter();
  const [cvData, setCVData] = useState<ICVProfile | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { fetchMyCVProfile } = useCV();

  useEffect(() => {
    const loadCVData = async () => {
      setIsLoading(true);
      const result = await fetchMyCVProfile();

      if (result) {
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

      setIsLoading(false);
    };

    loadCVData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Đang tải CV...</p>
        </div>
      </div>
    );
  }

  if (!cvData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Không tìm thấy CV</p>
          <Button onClick={() => router.push("/profile?tab=create-cv")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push("/profile?tab=create-cv")}
                variant="outline"
                size="sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Xem trước CV</h1>
                <p className="text-sm text-muted-foreground">
                  Preview và tải xuống CV của bạn
                </p>
              </div>
            </div>
            <DownloadPDFButton
              cvData={cvData}
              fileName="CV"
              template={selectedTemplate as any}
              variant="default"
              size="default"
            />
          </div>
        </div>
      </div>

      {/* Template Selector & Preview Toggle */}
      <div className="bg-secondary border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedTemplate("classic")}
                className={`px-4 py-2 rounded-lg font-medium transition text-sm ${
                  selectedTemplate === "classic"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground hover:bg-border"
                }`}
              >
                Classic
              </button>
              <button
                onClick={() => setSelectedTemplate("modern")}
                className={`px-4 py-2 rounded-lg font-medium transition text-sm ${
                  selectedTemplate === "modern"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground hover:bg-border"
                }`}
              >
                Modern
              </button>
              <button
                onClick={() => setSelectedTemplate("minimal")}
                className={`px-4 py-2 rounded-lg font-medium transition text-sm ${
                  selectedTemplate === "minimal"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground hover:bg-border"
                }`}
              >
                Minimal
              </button>
            </div>

            <button
              onClick={() => setShowPDFPreview(!showPDFPreview)}
              className={`px-4 py-2 rounded-lg font-medium transition text-sm ${
                showPDFPreview
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground hover:bg-border"
              }`}
            >
              {showPDFPreview ? "📄 Xem HTML" : "📄 Xem PDF"}
            </button>
          </div>
        </div>
      </div>

      {/* CV Preview */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {showPDFPreview ? (
          // Live PDF Preview
          <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
            <PDFPreview
              cvData={cvData}
              template={selectedTemplate as any}
              height="calc(100vh - 280px)"
              className="rounded-lg overflow-hidden shadow-lg"
            />
          </div>
        ) : (
          // HTML Preview
          <div className="space-y-8">
            {selectedTemplate === "classic" && <ClassicTemplate cvData={cvData} />}
            {selectedTemplate === "modern" && <ModernTemplate cvData={cvData} />}
            {selectedTemplate === "minimal" && <MinimalTemplate cvData={cvData} />}
          </div>
        )}
      </div>
    </div>
  );
}

// Template components (copied from cv-preview-modal.tsx)
function ClassicTemplate({ cvData }: { cvData: ICVProfile }) {
  return (
    <div className="bg-white text-black p-8 rounded-lg space-y-6 shadow-lg max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b-2 border-black pb-4">
        <h1 className="text-3xl font-bold">{cvData.personalInfo.fullName}</h1>
        <p className="text-sm text-gray-600 mt-1">{cvData.personalInfo.bio}</p>
        <div className="flex flex-wrap gap-4 mt-3 text-sm">
          <span>{cvData.personalInfo.email}</span>
          <span>{cvData.personalInfo.phone}</span>
          <span>{cvData.personalInfo.address}</span>
        </div>
      </div>

      {/* Experience */}
      {cvData.experience.length > 0 && (
        <div>
          <h2 className="text-lg font-bold border-b border-gray-300 pb-2 mb-3">
            Experience
          </h2>
          {cvData.experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between">
                <h3 className="font-bold">{exp.position}</h3>
                <span className="text-sm text-gray-600">
                  {formatDateDisplay(exp.startDate)} - {formatDateDisplay(exp.endDate)}
                </span>
              </div>
              <p className="text-sm text-gray-600">{exp.company}</p>
              <p className="text-sm mt-1">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {cvData.education.length > 0 && (
        <div>
          <h2 className="text-lg font-bold border-b border-gray-300 pb-2 mb-3">
            Education
          </h2>
          {cvData.education.map((edu) => (
            <div key={edu.id} className="mb-4">
              <div className="flex justify-between">
                <h3 className="font-bold">{edu.school}</h3>
                <span className="text-sm text-gray-600">{formatDateDisplay(edu.endDate)}</span>
              </div>
              <p className="text-sm text-gray-600">
                {edu.degree} in {edu.field}
              </p>
              <p className="text-sm mt-1">{edu.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {cvData.skills.length > 0 && (
        <div>
          <h2 className="text-lg font-bold border-b border-gray-300 pb-2 mb-3">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {cvData.skills.map((skill) => (
              <span
                key={skill.id}
                className="px-3 py-1 bg-gray-200 text-black rounded text-sm"
              >
                {skill.name} ({skill.level})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {cvData.languages.length > 0 && (
        <div>
          <h2 className="text-lg font-bold border-b border-gray-300 pb-2 mb-3">
            Languages
          </h2>
          <div className="flex flex-wrap gap-2">
            {cvData.languages.map((lang) => (
              <span
                key={lang.id}
                className="px-3 py-1 bg-gray-200 text-black rounded text-sm"
              >
                {lang.name} ({lang.proficiency})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {cvData.projects.length > 0 && (
        <div>
          <h2 className="text-lg font-bold border-b border-gray-300 pb-2 mb-3">
            Projects
          </h2>
          {cvData.projects.map((project) => (
            <div key={project.id} className="mb-4">
              <h3 className="font-bold">{project.name}</h3>
              <p className="text-sm mt-1">{project.description}</p>
              {project.link && (
                <a href={project.link} className="text-sm text-blue-600 hover:underline mt-1 block">
                  {project.link}
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certificates */}
      {cvData.certificates.length > 0 && (
        <div>
          <h2 className="text-lg font-bold border-b border-gray-300 pb-2 mb-3">
            Certificates
          </h2>
          {cvData.certificates.map((cert) => (
            <div key={cert.id} className="mb-4">
              <div className="flex justify-between">
                <h3 className="font-bold">{cert.name}</h3>
                <span className="text-sm text-gray-600">{formatDateDisplay(cert.date)}</span>
              </div>
              <p className="text-sm text-gray-600">{cert.issuer}</p>
            </div>
          ))}
        </div>
      )}

      {/* Awards */}
      {cvData.awards.length > 0 && (
        <div>
          <h2 className="text-lg font-bold border-b border-gray-300 pb-2 mb-3">
            Awards & Recognition
          </h2>
          {cvData.awards.map((award) => (
            <div key={award.id} className="mb-4">
              <div className="flex justify-between">
                <h3 className="font-bold">{award.name}</h3>
                <span className="text-sm text-gray-600">{formatDateDisplay(award.date)}</span>
              </div>
              <p className="text-sm mt-1">{award.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ModernTemplate({ cvData }: { cvData: ICVProfile }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-800 p-8 rounded-lg space-y-6 shadow-lg max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-lg">
        <h1 className="text-4xl font-bold">{cvData.personalInfo.fullName}</h1>
        <p className="text-blue-100 mt-2">{cvData.personalInfo.bio}</p>
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          <span>📧 {cvData.personalInfo.email}</span>
          <span>📱 {cvData.personalInfo.phone}</span>
          <span>📍 {cvData.personalInfo.address}</span>
        </div>
      </div>

      {/* Experience */}
      {cvData.experience.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-blue-600 mb-4">💼 Experience</h2>
          {cvData.experience.map((exp) => (
            <div key={exp.id} className="mb-4 p-4 bg-white rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{exp.position}</h3>
                  <p className="text-blue-600 font-medium">{exp.company}</p>
                </div>
                <span className="text-sm text-gray-600">
                  {formatDateDisplay(exp.startDate)} - {formatDateDisplay(exp.endDate)}
                </span>
              </div>
              <p className="text-sm mt-2">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {cvData.education.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-blue-600 mb-4">🎓 Education</h2>
          {cvData.education.map((edu) => (
            <div key={edu.id} className="mb-4 p-4 bg-white rounded-lg">
              <h3 className="font-bold text-lg">{edu.school}</h3>
              <p className="text-blue-600 font-medium">
                {edu.degree} in {edu.field}
              </p>
              <p className="text-sm mt-2">{edu.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {cvData.skills.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-blue-600 mb-4">⚡ Skills</h2>
          <div className="grid grid-cols-2 gap-2">
            {cvData.skills.map((skill) => (
              <div key={skill.id} className="p-3 bg-white rounded-lg">
                <p className="font-medium">{skill.name}</p>
                <p className="text-sm text-gray-600">{skill.level}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {cvData.languages.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-blue-600 mb-4">🌐 Languages</h2>
          <div className="grid grid-cols-2 gap-2">
            {cvData.languages.map((lang) => (
              <div key={lang.id} className="p-3 bg-white rounded-lg">
                <p className="font-medium">{lang.name}</p>
                <p className="text-sm text-gray-600">{lang.proficiency}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {cvData.projects.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-blue-600 mb-4">🚀 Projects</h2>
          {cvData.projects.map((project) => (
            <div key={project.id} className="mb-4 p-4 bg-white rounded-lg">
              <h3 className="font-bold text-lg">{project.name}</h3>
              <p className="text-sm mt-2">{project.description}</p>
              {project.link && (
                <a href={project.link} className="text-sm text-blue-600 hover:underline mt-2 block">
                  🔗 {project.link}
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certificates */}
      {cvData.certificates.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-blue-600 mb-4">📜 Certificates</h2>
          {cvData.certificates.map((cert) => (
            <div key={cert.id} className="mb-4 p-4 bg-white rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{cert.name}</h3>
                  <p className="text-blue-600 font-medium">{cert.issuer}</p>
                </div>
                <span className="text-sm text-gray-600">{formatDateDisplay(cert.date)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Awards */}
      {cvData.awards.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-blue-600 mb-4">🏆 Awards</h2>
          {cvData.awards.map((award) => (
            <div key={award.id} className="mb-4 p-4 bg-white rounded-lg">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg">{award.name}</h3>
                <span className="text-sm text-gray-600">{formatDateDisplay(award.date)}</span>
              </div>
              <p className="text-sm mt-2">{award.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MinimalTemplate({ cvData }: { cvData: ICVProfile }) {
  return (
    <div className="bg-white text-gray-800 p-8 rounded-lg space-y-6 shadow-lg max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-light tracking-wide">
          {cvData.personalInfo.fullName}
        </h1>
        <p className="text-sm text-gray-600 mt-2">{cvData.personalInfo.bio}</p>
        <div className="flex gap-4 mt-3 text-xs text-gray-600">
          <span>{cvData.personalInfo.email}</span>
          <span>•</span>
          <span>{cvData.personalInfo.phone}</span>
          <span>•</span>
          <span>{cvData.personalInfo.address}</span>
        </div>
      </div>

      <hr className="border-gray-300" />

      {/* Experience */}
      {cvData.experience.length > 0 && (
        <div>
          <h2 className="text-sm font-bold tracking-widest text-gray-700 mb-4">
            EXPERIENCE
          </h2>
          {cvData.experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold">{exp.position}</h3>
                <span className="text-xs text-gray-600">
                  {formatDateDisplay(exp.startDate)} – {formatDateDisplay(exp.endDate)}
                </span>
              </div>
              <p className="text-sm text-gray-600">{exp.company}</p>
              <p className="text-sm mt-1 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {cvData.education.length > 0 && (
        <div>
          <h2 className="text-sm font-bold tracking-widest text-gray-700 mb-4">
            EDUCATION
          </h2>
          {cvData.education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <h3 className="font-semibold">{edu.school}</h3>
              <p className="text-sm text-gray-600">
                {edu.degree}, {edu.field}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {cvData.skills.length > 0 && (
        <div>
          <h2 className="text-sm font-bold tracking-widest text-gray-700 mb-3">
            SKILLS
          </h2>
          <p className="text-sm text-gray-700">
            {cvData.skills.map((s) => `${s.name} (${s.level})`).join(", ")}
          </p>
        </div>
      )}

      {/* Languages */}
      {cvData.languages.length > 0 && (
        <div>
          <h2 className="text-sm font-bold tracking-widest text-gray-700 mb-3">
            LANGUAGES
          </h2>
          <p className="text-sm text-gray-700">
            {cvData.languages.map((l) => `${l.name} (${l.proficiency})`).join(", ")}
          </p>
        </div>
      )}

      {/* Projects */}
      {cvData.projects.length > 0 && (
        <div>
          <h2 className="text-sm font-bold tracking-widest text-gray-700 mb-4">
            PROJECTS
          </h2>
          {cvData.projects.map((project) => (
            <div key={project.id} className="mb-4">
              <h3 className="font-semibold">{project.name}</h3>
              <p className="text-sm mt-1 leading-relaxed">{project.description}</p>
              {project.link && (
                <p className="text-xs text-gray-600 mt-1">{project.link}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certificates */}
      {cvData.certificates.length > 0 && (
        <div>
          <h2 className="text-sm font-bold tracking-widest text-gray-700 mb-4">
            CERTIFICATES
          </h2>
          {cvData.certificates.map((cert) => (
            <div key={cert.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold">{cert.name}</h3>
                <span className="text-xs text-gray-600">{formatDateDisplay(cert.date)}</span>
              </div>
              <p className="text-sm text-gray-600">{cert.issuer}</p>
            </div>
          ))}
        </div>
      )}

      {/* Awards */}
      {cvData.awards.length > 0 && (
        <div>
          <h2 className="text-sm font-bold tracking-widest text-gray-700 mb-4">
            AWARDS & RECOGNITION
          </h2>
          {cvData.awards.map((award) => (
            <div key={award.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold">{award.name}</h3>
                <span className="text-xs text-gray-600">{formatDateDisplay(award.date)}</span>
              </div>
              <p className="text-sm mt-1 leading-relaxed">{award.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
