"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Loader2, FileText, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ICVProfile } from "@/shared/types/cv";
import { useCV } from "@/hooks/use-cv";
import DownloadPDFButton from "@/components/pdf/download-pdf-button";
import PDFPreview from "@/components/pdf/pdf-preview";
import { ClassicTemplate, ModernTemplate, MinimalTemplate } from "@/components/cv/templates";

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
            avatar: result.personalInfo.avatar || "",
            title: result.personalInfo.title || "",
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
            position: proj.position || "",
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
          <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Không tìm thấy CV</h2>
          <p className="text-muted-foreground mb-4">Vui lòng tạo CV trước khi xem.</p>
          <Button onClick={() => router.push("/profile?tab=create-cv")}>Tạo CV mới</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/profile?tab=create-cv")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại chỉnh sửa
            </Button>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPDFPreview(!showPDFPreview)}
                className="flex items-center gap-2"
              >
                {showPDFPreview ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Ẩn PDF
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Xem PDF
                  </>
                )}
              </Button>

              <DownloadPDFButton
                cvData={cvData}
                template={selectedTemplate as "classic" | "modern" | "minimal"}
                fileName={`CV_${cvData.personalInfo.fullName?.replace(/\s+/g, "_") || "CV"}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Template Selector & Preview Toggle */}
      <div className="bg-secondary/50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium">Chọn mẫu CV:</span>
            <div className="flex gap-2">
              <Button
                variant={selectedTemplate === "classic" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTemplate("classic")}
              >
                Classic
              </Button>
              <Button
                variant={selectedTemplate === "modern" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTemplate("modern")}
              >
                Modern
              </Button>
              <Button
                variant={selectedTemplate === "minimal" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTemplate("minimal")}
              >
                Minimal
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* CV Preview */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {showPDFPreview ? (
          <Card className="p-4 md:p-6 bg-white dark:bg-card border border-border shadow-lg">
            <PDFPreview cvData={cvData} template={selectedTemplate as "classic" | "modern" | "minimal"} />
          </Card>
        ) : (
          <Card className="p-6 md:p-8 bg-white dark:bg-card border border-border shadow-lg">
            {selectedTemplate === "classic" && <ClassicTemplate cvData={cvData} />}
            {selectedTemplate === "modern" && <ModernTemplate cvData={cvData} />}
            {selectedTemplate === "minimal" && <MinimalTemplate cvData={cvData} />}
          </Card>
        )}
      </div>
    </div>
  );
}
