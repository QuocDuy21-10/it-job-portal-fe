/**
 * CV PDF Document - Main Orchestrator
 * Routes between different CV templates
 *
 * This file acts as a template selector/router.
 * All template implementations are in separate files for better organization.
 */

import React from "react";
import { ICVProfile } from "@/shared/types/cv";
import { registerFonts } from "@/features/cv-builder/lib/pdf/fonts";
import ClassicCVTemplate from "@/features/cv-builder/components/pdf/templates/classic/ClassicTemplate";
import ModernCVTemplate from "@/features/cv-builder/components/pdf/templates/modern/ModernTemplate";
import MinimalCVTemplate from "@/features/cv-builder/components/pdf/templates/minimal/MinimalTemplate";

interface CVPdfDocumentProps {
  cvData: ICVProfile;
  template?: "classic" | "modern" | "minimal";
}

registerFonts();

/**
 * Main CV PDF Document Component
 * Routes to appropriate template based on selection
 */
const CVPdfDocument: React.FC<CVPdfDocumentProps> = ({
  cvData,
  template = "classic",
}) => {
  switch (template) {
    case "modern":
      return <ModernCVTemplate cvData={cvData} />;
    case "minimal":
      return <MinimalCVTemplate cvData={cvData} />;
    case "classic":
    default:
      return <ClassicCVTemplate cvData={cvData} />;
  }
};

export default CVPdfDocument;
