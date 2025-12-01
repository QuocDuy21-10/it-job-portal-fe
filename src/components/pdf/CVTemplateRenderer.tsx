/**
 * CV Template Renderer
 * Wrapper component for rendering different CV template types
 */

import React from "react";
import { ICVProfile } from "@/shared/types/cv";
import ModernCVTemplate from "./templates/modern/ModernTemplate";
import ClassicCVTemplate from "./templates/classic/ClassicTemplate";
import MinimalCVTemplate from "./templates/minimal/MinimalTemplate";

export type CVTemplateType = "modern" | "classic" | "minimal";

interface CVTemplateRendererProps {
  cvData: ICVProfile;
  templateType?: CVTemplateType;
}

/**
 * CV Template Renderer Component
 * Renders the appropriate CV template based on templateType
 * 
 * @param cvData - CV profile data
 * @param templateType - Template type to render (default: "modern")
 * 
 * @example
 * ```tsx
 * <CVTemplateRenderer 
 *   cvData={cvProfile} 
 *   templateType="modern" 
 * />
 * ```
 */
export const CVTemplateRenderer: React.FC<CVTemplateRendererProps> = ({
  cvData,
  templateType = "modern",
}) => {
  switch (templateType) {
    case "classic":
      return <ClassicCVTemplate cvData={cvData} />;
    case "minimal":
      return <MinimalCVTemplate cvData={cvData} />;
    case "modern":
    default:
      return <ModernCVTemplate cvData={cvData} />;
  }
};

/**
 * Get template display name
 */
export function getTemplateDisplayName(templateType: CVTemplateType): string {
  const names: Record<CVTemplateType, string> = {
    modern: "Modern - Hiện đại",
    classic: "Classic - Cổ điển",
    minimal: "Minimal - Tối giản",
  };
  return names[templateType];
}

/**
 * Get template description
 */
export function getTemplateDescription(templateType: CVTemplateType): string {
  const descriptions: Record<CVTemplateType, string> = {
    modern: "Thiết kế hai cột chuyên nghiệp, phù hợp cho ngành công nghệ",
    classic: "Thiết kế truyền thống, dễ đọc, phù hợp cho môi trường doanh nghiệp",
    minimal: "Thiết kế tối giản, thanh lịch, tập trung vào nội dung",
  };
  return descriptions[templateType];
}

/**
 * List all available templates
 */
export const AVAILABLE_TEMPLATES: Array<{
  type: CVTemplateType;
  name: string;
  description: string;
}> = [
  {
    type: "modern",
    name: getTemplateDisplayName("modern"),
    description: getTemplateDescription("modern"),
  },
  {
    type: "classic",
    name: getTemplateDisplayName("classic"),
    description: getTemplateDescription("classic"),
  },
  {
    type: "minimal",
    name: getTemplateDisplayName("minimal"),
    description: getTemplateDescription("minimal"),
  },
];
