/**
 * PDF Preview Component (Optional)
 * Hiển thị live preview của PDF trong UI
 * Sử dụng PDFViewer từ @react-pdf/renderer
 * 
 * LƯU Ý: 
 * - PDFViewer chỉ hoạt động trên client
 * - Có thể tốn tài nguyên nếu CV lớn
 * - Chỉ dùng cho preview, không phải production render
 */

"use client";

import React, { useState, useEffect } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import CVPdfDocument from "@/components/pdf/cv-pdf-document";
import { ICVProfile } from "@/shared/types/cv";
import { Loader2 } from "lucide-react";

interface PDFPreviewProps {
  cvData: ICVProfile;
  template?: "classic" | "modern" | "minimal";
  width?: string;
  height?: string;
  className?: string;
}

/**
 * Component để preview PDF trực tiếp trong browser
 * Chỉ dùng cho development/preview, không dùng trong production
 */
const PDFPreview: React.FC<PDFPreviewProps> = ({
  cvData,
  template = "classic",
  width = "100%",
  height = "600px",
  className = "",
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div
        className={`flex items-center justify-center bg-secondary rounded-lg ${className}`}
        style={{ width, height }}
      >
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
          <p className="text-sm text-muted-foreground">Đang tải preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={{ width, height }}>
      <PDFViewer width="100%" height="100%" showToolbar={true}>
        <CVPdfDocument cvData={cvData} template={template} />
      </PDFViewer>
    </div>
  );
};

export default PDFPreview;
