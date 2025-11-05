"use client";

import { X, Download } from "lucide-react";

interface CVData {
  personalInfo: {
    fullName: string;
    phone: string;
    email: string;
    birthday: string;
    gender: string;
    address: string;
    personalLink: string;
    bio: string;
  };
  education: Array<{
    id: string;
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
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
    link: string;
  }>;
  certificates: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
  }>;
  awards: Array<{
    id: string;
    name: string;
    date: string;
    description: string;
  }>;
}

interface CVPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvData: CVData;
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
}

export default function CVPreviewModal({
  isOpen,
  onClose,
  cvData,
  selectedTemplate,
  onTemplateChange,
}: CVPreviewModalProps) {
  if (!isOpen) return null;

  const handleDownload = () => {
    alert("CV downloaded successfully!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background rounded-lg">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">CV Preview</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Template Selector */}
        <div className="bg-secondary border-b border-border p-4 flex gap-2">
          <button
            onClick={() => onTemplateChange("classic")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedTemplate === "classic"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground hover:bg-border"
            }`}
          >
            Classic
          </button>
          <button
            onClick={() => onTemplateChange("modern")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedTemplate === "modern"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground hover:bg-border"
            }`}
          >
            Modern
          </button>
          <button
            onClick={() => onTemplateChange("minimal")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedTemplate === "minimal"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground hover:bg-border"
            }`}
          >
            Minimal
          </button>
        </div>

        {/* CV Preview */}
        <div className="p-8 space-y-8">
          {selectedTemplate === "classic" && (
            <ClassicTemplate cvData={cvData} />
          )}
          {selectedTemplate === "modern" && <ModernTemplate cvData={cvData} />}
          {selectedTemplate === "minimal" && (
            <MinimalTemplate cvData={cvData} />
          )}
        </div>
      </div>
    </div>
  );
}

function ClassicTemplate({ cvData }: { cvData: CVData }) {
  return (
    <div className="bg-white text-black p-8 rounded-lg space-y-6">
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
                  {exp.startDate} - {exp.endDate}
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
                <span className="text-sm text-gray-600">{edu.endDate}</span>
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
    </div>
  );
}

function ModernTemplate({ cvData }: { cvData: CVData }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-800 p-8 rounded-lg space-y-6">
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
          <h2 className="text-2xl font-bold text-blue-600 mb-4">
            💼 Experience
          </h2>
          {cvData.experience.map((exp) => (
            <div key={exp.id} className="mb-4 p-4 bg-white rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{exp.position}</h3>
                  <p className="text-blue-600 font-medium">{exp.company}</p>
                </div>
                <span className="text-sm text-gray-600">
                  {exp.startDate} - {exp.endDate}
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
          <h2 className="text-2xl font-bold text-blue-600 mb-4">
            🎓 Education
          </h2>
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
    </div>
  );
}

function MinimalTemplate({ cvData }: { cvData: CVData }) {
  return (
    <div className="bg-white text-gray-800 p-8 rounded-lg space-y-6">
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
                  {exp.startDate} – {exp.endDate}
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
    </div>
  );
}
