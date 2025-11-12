"use client";

import { useState } from "react";
import { Download, Plus, ArrowLeft } from "lucide-react";
import CVFormSection from "@/components/sections/cv-form-section";
import CVPreviewModal from "@/components/modals/cv-preview-modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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

const initialCVData: CVData = {
  personalInfo: {
    fullName: "Nguyen Van A",
    phone: "+84 123 456 789",
    email: "email@example.com",
    birthday: "1995-01-15",
    gender: "Male",
    address: "Ho Chi Minh City, Vietnam",
    personalLink: "https://linkedin.com/in/example",
    bio: "Passionate frontend engineer with 5+ years of experience building scalable web applications.",
  },
  education: [
    {
      id: "1",
      school: "University of Science and Technology",
      degree: "Bachelor",
      field: "Computer Science",
      startDate: "2015-09",
      endDate: "2019-06",
      description: "GPA: 3.8/4.0",
    },
  ],
  experience: [
    {
      id: "1",
      company: "TechCorp Vietnam",
      position: "Senior Frontend Engineer",
      startDate: "2022-01",
      endDate: "Present",
      description:
        "Leading frontend development team, mentoring junior developers.",
    },
  ],
  skills: [
    { id: "1", name: "React", level: "Expert" },
    { id: "2", name: "TypeScript", level: "Expert" },
    { id: "3", name: "Next.js", level: "Advanced" },
  ],
  languages: [
    { id: "1", name: "English", proficiency: "Advanced" },
    { id: "2", name: "Vietnamese", proficiency: "Native" },
  ],
  projects: [
    {
      id: "1",
      name: "E-commerce Platform",
      description:
        "Built scalable e-commerce platform using Next.js and Node.js",
      link: "https://example.com",
    },
  ],
  certificates: [
    {
      id: "1",
      name: "AWS Certified Developer",
      issuer: "Amazon Web Services",
      date: "2023-06",
    },
  ],
  awards: [
    {
      id: "1",
      name: "Employee of the Year",
      date: "2023",
      description: "Recognized for outstanding contribution to the team.",
    },
  ],
};

interface CreateCVPageProps {
  onBack?: () => void;
}

export default function CreateCVPage({ onBack }: CreateCVPageProps) {
  const [cvData, setCVData] = useState<CVData>(initialCVData);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("classic");

  const updatePersonalInfo = (field: string, value: string) => {
    setCVData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  const addEducation = () => {
    setCVData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Date.now().toString(),
          school: "",
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    }));
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setCVData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const removeEducation = (id: string) => {
    setCVData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const addExperience = () => {
    setCVData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: Date.now().toString(),
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    }));
  };

  const updateExperience = (id: string, field: string, value: string) => {
    setCVData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const removeExperience = (id: string) => {
    setCVData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
  };

  const addSkill = () => {
    setCVData((prev) => ({
      ...prev,
      skills: [
        ...prev.skills,
        { id: Date.now().toString(), name: "", level: "Intermediate" },
      ],
    }));
  };

  const updateSkill = (id: string, field: string, value: string) => {
    setCVData((prev) => ({
      ...prev,
      skills: prev.skills.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      ),
    }));
  };

  const removeSkill = (id: string) => {
    setCVData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill.id !== id),
    }));
  };

  const addLanguage = () => {
    setCVData((prev) => ({
      ...prev,
      languages: [
        ...prev.languages,
        { id: Date.now().toString(), name: "", proficiency: "Intermediate" },
      ],
    }));
  };

  const updateLanguage = (id: string, field: string, value: string) => {
    setCVData((prev) => ({
      ...prev,
      languages: prev.languages.map((lang) =>
        lang.id === id ? { ...lang, [field]: value } : lang
      ),
    }));
  };

  const removeLanguage = (id: string) => {
    setCVData((prev) => ({
      ...prev,
      languages: prev.languages.filter((lang) => lang.id !== id),
    }));
  };

  const addProject = () => {
    setCVData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { id: Date.now().toString(), name: "", description: "", link: "" },
      ],
    }));
  };

  const updateProject = (id: string, field: string, value: string) => {
    setCVData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj) =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    }));
  };

  const removeProject = (id: string) => {
    setCVData((prev) => ({
      ...prev,
      projects: prev.projects.filter((proj) => proj.id !== id),
    }));
  };

  const addCertificate = () => {
    setCVData((prev) => ({
      ...prev,
      certificates: [
        ...prev.certificates,
        { id: Date.now().toString(), name: "", issuer: "", date: "" },
      ],
    }));
  };

  const updateCertificate = (id: string, field: string, value: string) => {
    setCVData((prev) => ({
      ...prev,
      certificates: prev.certificates.map((cert) =>
        cert.id === id ? { ...cert, [field]: value } : cert
      ),
    }));
  };

  const removeCertificate = (id: string) => {
    setCVData((prev) => ({
      ...prev,
      certificates: prev.certificates.filter((cert) => cert.id !== id),
    }));
  };

  const addAward = () => {
    setCVData((prev) => ({
      ...prev,
      awards: [
        ...prev.awards,
        { id: Date.now().toString(), name: "", date: "", description: "" },
      ],
    }));
  };

  const updateAward = (id: string, field: string, value: string) => {
    setCVData((prev) => ({
      ...prev,
      awards: prev.awards.map((award) =>
        award.id === id ? { ...award, [field]: value } : award
      ),
    }));
  };

  const removeAward = (id: string) => {
    setCVData((prev) => ({
      ...prev,
      awards: prev.awards.filter((award) => award.id !== id),
    }));
  };

  return (
    <div className="bg-background min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>
          )}
          <h1 className="text-4xl font-bold mb-2">
            Tạo CV của bạn (Create Your CV)
          </h1>
          <p className="text-muted-foreground">
            Cập nhật thông tin cá nhân và trải nghiệm của bạn
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <Button
            onClick={() => setIsPreviewOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            <Download className="w-4 h-4 mr-2" />
            Preview & Download CV
          </Button>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
            Cập nhật CV (Update CV)
          </Button>
        </div>

        {/* Form Sections */}
        <div className="space-y-8">
          {/* Personal Information */}
          <CVFormSection
            title="Personal Information"
            description="Update your personal details"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={cvData.personalInfo.fullName}
                  onChange={(e) =>
                    updatePersonalInfo("fullName", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={cvData.personalInfo.email}
                  onChange={(e) => updatePersonalInfo("email", e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  value={cvData.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Birthday
                </label>
                <input
                  type="date"
                  value={cvData.personalInfo.birthday}
                  onChange={(e) =>
                    updatePersonalInfo("birthday", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Gender</label>
                <select
                  value={cvData.personalInfo.gender}
                  onChange={(e) => updatePersonalInfo("gender", e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={cvData.personalInfo.address}
                  onChange={(e) =>
                    updatePersonalInfo("address", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Personal Link
                </label>
                <input
                  type="url"
                  value={cvData.personalInfo.personalLink}
                  onChange={(e) =>
                    updatePersonalInfo("personalLink", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea
                  value={cvData.personalInfo.bio}
                  onChange={(e) => updatePersonalInfo("bio", e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
            </div>
          </CVFormSection>

          {/* Education */}
          <CVFormSection
            title="Education"
            description="Add your educational background"
            actionButton={
              <button
                onClick={addEducation}
                className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Education
              </button>
            }
          >
            <div className="space-y-4">
              {cvData.education.map((edu) => (
                <Card key={edu.id} className="p-4 bg-secondary/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        School
                      </label>
                      <input
                        type="text"
                        value={edu.school}
                        onChange={(e) =>
                          updateEducation(edu.id, "school", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Degree
                      </label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) =>
                          updateEducation(edu.id, "degree", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Field of Study
                      </label>
                      <input
                        type="text"
                        value={edu.field}
                        onChange={(e) =>
                          updateEducation(edu.id, "field", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        End Date
                      </label>
                      <input
                        type="month"
                        value={edu.endDate}
                        onChange={(e) =>
                          updateEducation(edu.id, "endDate", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">
                        Description
                      </label>
                      <textarea
                        value={edu.description}
                        onChange={(e) =>
                          updateEducation(edu.id, "description", e.target.value)
                        }
                        rows={2}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeEducation(edu.id)}
                    className="mt-4 text-destructive hover:text-destructive/80 font-medium text-sm"
                  >
                    Remove
                  </button>
                </Card>
              ))}
            </div>
          </CVFormSection>

          {/* Experience */}
          <CVFormSection
            title="Work Experience"
            description="Add your professional experience"
            actionButton={
              <button
                onClick={addExperience}
                className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Experience
              </button>
            }
          >
            <div className="space-y-4">
              {cvData.experience.map((exp) => (
                <Card key={exp.id} className="p-4 bg-secondary/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) =>
                          updateExperience(exp.id, "company", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Position
                      </label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) =>
                          updateExperience(exp.id, "position", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Start Date
                      </label>
                      <input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) =>
                          updateExperience(exp.id, "startDate", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        End Date
                      </label>
                      <input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) =>
                          updateExperience(exp.id, "endDate", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">
                        Description
                      </label>
                      <textarea
                        value={exp.description}
                        onChange={(e) =>
                          updateExperience(
                            exp.id,
                            "description",
                            e.target.value
                          )
                        }
                        rows={2}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeExperience(exp.id)}
                    className="mt-4 text-destructive hover:text-destructive/80 font-medium text-sm"
                  >
                    Remove
                  </button>
                </Card>
              ))}
            </div>
          </CVFormSection>

          {/* Skills */}
          <CVFormSection
            title="Skills"
            description="Add your professional skills"
            actionButton={
              <button
                onClick={addSkill}
                className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Skill
              </button>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cvData.skills.map((skill) => (
                <Card key={skill.id} className="p-4 bg-secondary/50">
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Skill Name
                      </label>
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) =>
                          updateSkill(skill.id, "name", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Level
                      </label>
                      <select
                        value={skill.level}
                        onChange={(e) =>
                          updateSkill(skill.id, "level", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                        <option>Expert</option>
                      </select>
                    </div>
                    <button
                      onClick={() => removeSkill(skill.id)}
                      className="w-full text-destructive hover:text-destructive/80 font-medium text-sm py-2"
                    >
                      Remove
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </CVFormSection>

          {/* Languages */}
          <CVFormSection
            title="Languages"
            description="Add languages you speak"
            actionButton={
              <button
                onClick={addLanguage}
                className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Language
              </button>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cvData.languages.map((lang) => (
                <Card key={lang.id} className="p-4 bg-secondary/50">
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Language
                      </label>
                      <input
                        type="text"
                        value={lang.name}
                        onChange={(e) =>
                          updateLanguage(lang.id, "name", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Proficiency
                      </label>
                      <select
                        value={lang.proficiency}
                        onChange={(e) =>
                          updateLanguage(lang.id, "proficiency", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                        <option>Native</option>
                      </select>
                    </div>
                    <button
                      onClick={() => removeLanguage(lang.id)}
                      className="w-full text-destructive hover:text-destructive/80 font-medium text-sm py-2"
                    >
                      Remove
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </CVFormSection>

          {/* Projects */}
          <CVFormSection
            title="Projects"
            description="Showcase your projects"
            actionButton={
              <button
                onClick={addProject}
                className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Project
              </button>
            }
          >
            <div className="space-y-4">
              {cvData.projects.map((proj) => (
                <Card key={proj.id} className="p-4 bg-secondary/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">
                        Project Name
                      </label>
                      <input
                        type="text"
                        value={proj.name}
                        onChange={(e) =>
                          updateProject(proj.id, "name", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">
                        Description
                      </label>
                      <textarea
                        value={proj.description}
                        onChange={(e) =>
                          updateProject(proj.id, "description", e.target.value)
                        }
                        rows={2}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">
                        Link
                      </label>
                      <input
                        type="url"
                        value={proj.link}
                        onChange={(e) =>
                          updateProject(proj.id, "link", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeProject(proj.id)}
                    className="mt-4 text-destructive hover:text-destructive/80 font-medium text-sm"
                  >
                    Remove
                  </button>
                </Card>
              ))}
            </div>
          </CVFormSection>

          {/* Certificates */}
          <CVFormSection
            title="Certificates"
            description="Add your certificates and credentials"
            actionButton={
              <button
                onClick={addCertificate}
                className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Certificate
              </button>
            }
          >
            <div className="space-y-4">
              {cvData.certificates.map((cert) => (
                <Card key={cert.id} className="p-4 bg-secondary/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Certificate Name
                      </label>
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) =>
                          updateCertificate(cert.id, "name", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Issuer
                      </label>
                      <input
                        type="text"
                        value={cert.issuer}
                        onChange={(e) =>
                          updateCertificate(cert.id, "issuer", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">
                        Date
                      </label>
                      <input
                        type="month"
                        value={cert.date}
                        onChange={(e) =>
                          updateCertificate(cert.id, "date", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeCertificate(cert.id)}
                    className="mt-4 text-destructive hover:text-destructive/80 font-medium text-sm"
                  >
                    Remove
                  </button>
                </Card>
              ))}
            </div>
          </CVFormSection>

          {/* Awards */}
          <CVFormSection
            title="Awards & Recognition"
            description="Highlight your awards and achievements"
            actionButton={
              <button
                onClick={addAward}
                className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Award
              </button>
            }
          >
            <div className="space-y-4">
              {cvData.awards.map((award) => (
                <Card key={award.id} className="p-4 bg-secondary/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Award Name
                      </label>
                      <input
                        type="text"
                        value={award.name}
                        onChange={(e) =>
                          updateAward(award.id, "name", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Date
                      </label>
                      <input
                        type="month"
                        value={award.date}
                        onChange={(e) =>
                          updateAward(award.id, "date", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">
                        Description
                      </label>
                      <textarea
                        value={award.description}
                        onChange={(e) =>
                          updateAward(award.id, "description", e.target.value)
                        }
                        rows={2}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeAward(award.id)}
                    className="mt-4 text-destructive hover:text-destructive/80 font-medium text-sm"
                  >
                    Remove
                  </button>
                </Card>
              ))}
            </div>
          </CVFormSection>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex gap-4 mt-12 flex-wrap">
          <Button
            onClick={() => setIsPreviewOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            <Download className="w-4 h-4 mr-2" />
            Preview & Download CV
          </Button>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
            Cập nhật CV (Update CV)
          </Button>
        </div>
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
