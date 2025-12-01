/**
 * Download PDF Button Component
 * Sử dụng PDFDownloadLink từ @react-pdf/renderer
 * 
 * LƯU Ý:
 * - PDFDownloadLink chỉ render trên client (CSR)
 * - Có thể lag nếu CV data lớn → Cần loading state tốt
 * - Document được generate khi component mount
 */

"use client";

import React, { useState, useMemo } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CVPdfDocument from "@/components/pdf/cv-pdf-document";
import { ICVProfile } from "@/shared/types/cv";
import { generateCVDataKey } from "@/lib/pdf/helpers";

interface DownloadPDFButtonProps {
  cvData: ICVProfile;
  fileName?: string;
  template?: "classic" | "modern" | "minimal";
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

/**
 * Button để download PDF CV
 * Tự động generate PDF khi click
 */
const DownloadPDFButton: React.FC<DownloadPDFButtonProps> = ({
  cvData,
  fileName = "CV",
  template = "classic",
  variant = "default",
  size = "default",
  className = "",
}) => {
  const [isClient, setIsClient] = useState(false);

  // PDFDownloadLink chỉ hoạt động trên client
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Generate stable key based on data content to fix "Eo is not a function" bug
  // Solution from: https://github.com/diegomura/react-pdf/issues/3178
  const renderKey = useMemo(() => {
    return generateCVDataKey(cvData, template);
  }, [cvData, template]);

  if (!isClient) {
    // Hiển thị loading button khi chưa mount
    return (
      <Button variant={variant} size={size} className={className} disabled>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Đang chuẩn bị...
      </Button>
    );
  }

  // Generate filename with timestamp
  const generateFileName = () => {
    const timestamp = new Date().toISOString().split("T")[0];
    const name = cvData.personalInfo.fullName.replace(/\s+/g, "_");
    return `${fileName}_${name}_${timestamp}.pdf`;
  };

  return (
    <PDFDownloadLink
      key={renderKey}
      document={<CVPdfDocument cvData={cvData} template={template} />}
      fileName={generateFileName()}
    >
      {({ blob, url, loading, error }) => {
        if (error) {
          return (
            <Button variant="destructive" size={size} className={className} disabled>
              Lỗi tạo PDF
            </Button>
          );
        }

        return (
          <Button
            variant={variant}
            size={size}
            className={className}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang tạo PDF...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </>
            )}
          </Button>
        );
      }}
    </PDFDownloadLink>
  );
};

export default DownloadPDFButton;
