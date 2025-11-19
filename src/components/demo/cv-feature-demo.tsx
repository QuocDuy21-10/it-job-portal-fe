/**
 * CV Feature Demo
 * Ví dụ đầy đủ cách sử dụng các components CV
 * 
 * File này chỉ để tham khảo, KHÔNG import vào production
 */

"use client";

import { useState } from "react";
import { ICVProfile } from "@/shared/types/cv";
import { useCV } from "@/hooks/use-cv";
import DownloadPDFButton from "@/components/pdf/download-pdf-button";
import PDFPreview from "@/components/pdf/pdf-preview";
import CVPreviewModal from "@/components/modals/cv-preview-modal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { validateCVData, getCVCompleteness } from "@/lib/utils/cv-utils";

// Sample CV Data
const sampleCVData: ICVProfile = {
  personalInfo: {
    fullName: "Nguyễn Văn A",
    phone: "0123456789",
    email: "nguyenvana@example.com",
    birthday: "1995-05-15",
    gender: "Nam",
    address: "123 Đường ABC, Quận 1, TPHCM",
    personalLink: "https://linkedin.com/in/nguyenvana",
    bio: "Experienced Full Stack Developer with 5+ years of experience",
  },
  education: [
    {
      id: "edu-1",
      school: "Đại học Bách Khoa TPHCM",
      degree: "Bachelor of Engineering",
      field: "Computer Science",
      startDate: "2013-09",
      endDate: "2017-06",
      description: "GPA: 3.8/4.0 - Graduated with honors",
    },
  ],
  experience: [
    {
      id: "exp-1",
      company: "Tech Corp Vietnam",
      position: "Senior Backend Developer",
      startDate: "2020-01",
      endDate: "2023-12",
      description: "Developed and maintained microservices using NestJS, MongoDB, and Redis",
    },
  ],
  skills: [
    { id: "skill-1", name: "NestJS", level: "Advanced" },
    { id: "skill-2", name: "MongoDB", level: "Intermediate" },
    { id: "skill-3", name: "TypeScript", level: "Advanced" },
  ],
  languages: [
    { id: "lang-1", name: "Vietnamese", proficiency: "Native" },
    { id: "lang-2", name: "English", proficiency: "Fluent" },
  ],
  projects: [
    {
      id: "proj-1",
      name: "E-commerce Platform",
      description: "Full-stack e-commerce solution with payment integration",
      link: "https://github.com/user/ecommerce",
    },
  ],
  certificates: [
    {
      id: "cert-1",
      name: "AWS Certified Developer",
      issuer: "Amazon Web Services",
      date: "2022-06",
    },
  ],
  awards: [
    {
      id: "award-1",
      name: "Best Developer of the Year",
      date: "2023-12",
      description: "Awarded for outstanding performance and innovation",
    },
  ],
};

/**
 * Demo Component - Tất cả features
 */
export default function CVFeatureDemo() {
  const [cvData, setCVData] = useState<ICVProfile>(sampleCVData);
  const [template, setTemplate] = useState<"classic" | "modern" | "minimal">("classic");
  const [showModal, setShowModal] = useState(false);
  const [showPDFPreview, setShowPDFPreview] = useState(false);

  const { isLoading, error, upsertCV, clearError } = useCV();

  // Example 1: Save CV to API
  const handleSaveCV = async () => {
    // Validate first
    const validation = validateCVData(cvData);
    if (!validation.valid) {
      toast.error("Dữ liệu không hợp lệ", {
        description: validation.errors.join("\n"),
      });
      return;
    }

    // Call API
    const result = await upsertCV(cvData);

    if (result) {
      toast.success("✅ Lưu CV thành công!");
      setCVData(result); // Update with server response
    } else if (error) {
      toast.error("❌ Lỗi lưu CV", { description: error });
      clearError();
    }
  };

  // Example 2: Check CV completeness
  const completeness = getCVCompleteness(cvData);

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">CV Feature Demo</h1>

      {/* CV Completeness Indicator */}
      <div className="bg-card p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">CV Completeness</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-secondary rounded-full h-4 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${completeness.percentage}%` }}
            />
          </div>
          <span className="font-semibold text-lg">
            {completeness.percentage}%
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {completeness.completed} / {completeness.total} sections filled
        </p>
      </div>

      {/* Example 1: Download Button */}
      <div className="bg-card p-6 rounded-lg border space-y-4">
        <h2 className="text-xl font-semibold">Example 1: Download PDF Button</h2>
        <p className="text-muted-foreground">
          Simple download button - click to generate and download PDF
        </p>
        <DownloadPDFButton
          cvData={cvData}
          fileName="CV_Demo"
          template={template}
          variant="default"
        />
      </div>

      {/* Example 2: Template Selector */}
      <div className="bg-card p-6 rounded-lg border space-y-4">
        <h2 className="text-xl font-semibold">Example 2: Template Selector</h2>
        <div className="flex gap-3">
          <Button
            onClick={() => setTemplate("classic")}
            variant={template === "classic" ? "default" : "outline"}
          >
            Classic
          </Button>
          <Button
            onClick={() => setTemplate("modern")}
            variant={template === "modern" ? "default" : "outline"}
          >
            Modern
          </Button>
          <Button
            onClick={() => setTemplate("minimal")}
            variant={template === "minimal" ? "default" : "outline"}
          >
            Minimal
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Current template: <strong>{template}</strong>
        </p>
      </div>

      {/* Example 3: PDF Preview */}
      <div className="bg-card p-6 rounded-lg border space-y-4">
        <h2 className="text-xl font-semibold">Example 3: Live PDF Preview</h2>
        <Button onClick={() => setShowPDFPreview(!showPDFPreview)}>
          {showPDFPreview ? "Hide Preview" : "Show Preview"}
        </Button>

        {showPDFPreview && (
          <div className="mt-4">
            <PDFPreview
              cvData={cvData}
              template={template}
              height="600px"
              className="rounded-lg overflow-hidden shadow-lg"
            />
          </div>
        )}
      </div>

      {/* Example 4: Full Modal */}
      <div className="bg-card p-6 rounded-lg border space-y-4">
        <h2 className="text-xl font-semibold">Example 4: Preview Modal</h2>
        <p className="text-muted-foreground">
          Complete modal with HTML preview, PDF preview, and download
        </p>
        <Button onClick={() => setShowModal(true)}>Open Preview Modal</Button>

        <CVPreviewModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          cvData={cvData}
          selectedTemplate={template}
          onTemplateChange={(t) => setTemplate(t as any)}
        />
      </div>

      {/* Example 5: Save to API */}
      <div className="bg-card p-6 rounded-lg border space-y-4">
        <h2 className="text-xl font-semibold">Example 5: Save to API</h2>
        <p className="text-muted-foreground">
          POST /cv-profiles/upsert with loading state and error handling
        </p>
        <Button onClick={handleSaveCV} disabled={isLoading}>
          {isLoading ? "Đang lưu..." : "Lưu CV"}
        </Button>

        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
            <p className="font-semibold">Error:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Code Examples */}
      <div className="bg-card p-6 rounded-lg border space-y-4">
        <h2 className="text-xl font-semibold">Code Examples</h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">1. Import Components:</h3>
            <pre className="bg-secondary p-4 rounded text-sm overflow-x-auto">
{`import DownloadPDFButton from "@/components/pdf/download-pdf-button";
import PDFPreview from "@/components/pdf/pdf-preview";
import CVPreviewModal from "@/components/modals/cv-preview-modal";
import { useCV } from "@/hooks/use-cv";`}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">2. Use Download Button:</h3>
            <pre className="bg-secondary p-4 rounded text-sm overflow-x-auto">
{`<DownloadPDFButton
  cvData={cvData}
  fileName="My_CV"
  template="classic"
  variant="default"
/>`}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">3. Save CV via API:</h3>
            <pre className="bg-secondary p-4 rounded text-sm overflow-x-auto">
{`const { isLoading, error, upsertCV } = useCV();

const handleSave = async () => {
  const result = await upsertCV(cvData);
  if (result) {
    toast.success("Saved!");
  }
};`}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">4. Show Preview Modal:</h3>
            <pre className="bg-secondary p-4 rounded text-sm overflow-x-auto">
{`<CVPreviewModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  cvData={cvData}
  selectedTemplate="classic"
/>`}
            </pre>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
          💡 Pro Tips
        </h2>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <li>✅ Always validate CV data before submitting</li>
          <li>✅ Use loading states for better UX</li>
          <li>✅ Handle errors with toast notifications</li>
          <li>✅ Lazy load PDF preview (only when needed)</li>
          <li>✅ Use memoization for large CV data</li>
          <li>✅ Test with Vietnamese characters</li>
          <li>✅ Check generated PDF in different browsers</li>
        </ul>
      </div>
    </div>
  );
}
