/**
 * CV Feature - Barrel Export
 * Tập trung tất cả exports cho dễ import
 */

// Types
export type {
  ICVProfile,
  ICVPersonalInfo,
  ICVEducation,
  ICVExperience,
  ICVSkill,
  ICVLanguage,
  ICVProject,
  ICVCertificate,
  ICVAward,
  IUpsertCVProfileRequest,
  IUpsertCVProfileResponse,
} from "@/shared/types/cv";

// Service
export { cvService } from "@/features/cv/cv.service";

// Hook
export { useCV } from "@/hooks/use-cv";

// Components
export { default as CVPdfDocument } from "@/components/pdf/cv-pdf-document";
export { default as DownloadPDFButton } from "@/components/pdf/download-pdf-button";
export { default as PDFPreview } from "@/components/pdf/pdf-preview";

// Utils
export {
  prepareCVForAPI,
  formatCVDate,
  generateCVItemId,
  validateCVData,
  getCVCompleteness,
} from "@/lib/utils/cv-utils";

/**
 * Usage Example:
 * 
 * import { 
 *   useCV, 
 *   DownloadPDFButton, 
 *   ICVProfile,
 *   validateCVData 
 * } from "@/features/cv";
 */
