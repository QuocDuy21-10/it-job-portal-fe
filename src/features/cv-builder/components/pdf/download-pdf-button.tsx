"use client";

import React, { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ICVProfile } from "@/shared/types/cv";
import { useI18n } from "@/hooks/use-i18n";

interface DownloadPDFButtonProps {
  cvData: ICVProfile;
  fileName?: string;
  template?: "classic" | "modern" | "minimal";
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

// The PDF renderer (~500 kB) loads only when the user asks for the file.
const DownloadPDFButton: React.FC<DownloadPDFButtonProps> = ({
  cvData,
  fileName = "CV",
  template = "classic",
  variant = "default",
  size = "default",
  className = "",
}) => {
  const { t } = useI18n();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const [{ pdf }, { default: CVPdfDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/features/cv-builder/components/pdf/cv-pdf-document"),
      ]);
      const blob = await pdf(
        <CVPdfDocument cvData={cvData} template={template} />
      ).toBlob();

      const timestamp = new Date().toISOString().split("T")[0];
      const name = cvData.personalInfo.fullName.replace(/\s+/g, "_");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}_${name}_${timestamp}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      // Revoke on the next tick so the browser has started the download.
      setTimeout(() => URL.revokeObjectURL(url), 0);
    } catch {
      toast.error(t("downloadPdfButton.error"));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      disabled={isGenerating}
      onClick={handleDownload}
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          {t("downloadPdfButton.generating")}
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-2" />
          {t("downloadPdfButton.download")}
        </>
      )}
    </Button>
  );
};

export default DownloadPDFButton;
