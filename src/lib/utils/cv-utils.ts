/**
 * CV Data Utilities
 * Helper functions để transform và validate CV data
 */

import { ICVProfile, IUpsertCVProfileRequest } from "@/shared/types/cv";

/**
 * Transform CVData để phù hợp với API request
 * Loại bỏ các field không cần thiết (isDeleted, deletedAt, etc.)
 */
export const prepareCVForAPI = (cvData: ICVProfile): IUpsertCVProfileRequest => {
  return {
    personalInfo: {
      fullName: cvData.personalInfo.fullName,
      phone: cvData.personalInfo.phone,
      email: cvData.personalInfo.email,
      birthday: cvData.personalInfo.birthday,
      gender: cvData.personalInfo.gender,
      address: cvData.personalInfo.address,
      personalLink: cvData.personalInfo.personalLink,
      bio: cvData.personalInfo.bio,
    },
    education: cvData.education.map(({ id, school, degree, field, startDate, endDate, description }) => ({
      id,
      school,
      degree,
      field,
      startDate,
      endDate,
      description,
    })),
    experience: cvData.experience.map(({ id, company, position, startDate, endDate, description }) => ({
      id,
      company,
      position,
      startDate,
      endDate,
      description,
    })),
    skills: cvData.skills.map(({ id, name, level }) => ({
      id,
      name,
      level,
    })),
    languages: cvData.languages.map(({ id, name, proficiency }) => ({
      id,
      name,
      proficiency,
    })),
    projects: cvData.projects.map(({ id, name, description, link }) => ({
      id,
      name,
      description,
      link,
    })),
    certificates: cvData.certificates.map(({ id, name, issuer, date }) => ({
      id,
      name,
      issuer,
      date,
    })),
    awards: cvData.awards.map(({ id, name, date, description }) => ({
      id,
      name,
      date,
      description,
    })),
  };
};

/**
 * Format date cho display
 * Input: "2023-06" hoặc "2023-06-15"
 * Output: "Jun 2023" hoặc "June 15, 2023"
 */
export const formatCVDate = (dateString: string, format: "short" | "long" = "short"): string => {
  if (!dateString) return "";

  try {
    const parts = dateString.split("-");
    
    if (parts.length === 2) {
      // Format: YYYY-MM
      const [year, month] = parts;
      const date = new Date(parseInt(year), parseInt(month) - 1);
      
      if (format === "short") {
        return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
      } else {
        return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
      }
    } else if (parts.length === 3) {
      // Format: YYYY-MM-DD
      const date = new Date(dateString);
      
      if (format === "short") {
        return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
      } else {
        return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
      }
    }
    
    return dateString;
  } catch (error) {
    return dateString;
  }
};

/**
 * Generate unique ID cho các items trong CV
 */
export const generateCVItemId = (prefix: string = "item"): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Validate CV data trước khi submit
 */
export const validateCVData = (cvData: ICVProfile): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Required fields
  if (!cvData.personalInfo.fullName?.trim()) {
    errors.push("Họ tên không được để trống");
  }

  if (!cvData.personalInfo.email?.trim()) {
    errors.push("Email không được để trống");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cvData.personalInfo.email)) {
    errors.push("Email không hợp lệ");
  }

  if (!cvData.personalInfo.phone?.trim()) {
    errors.push("Số điện thoại không được để trống");
  }

  // Optional: Check if at least one section has data
  const hasContent =
    cvData.education.length > 0 ||
    cvData.experience.length > 0 ||
    cvData.skills.length > 0 ||
    cvData.projects.length > 0;

  if (!hasContent) {
    errors.push("CV cần có ít nhất một trong các phần: Học vấn, Kinh nghiệm, Kỹ năng, hoặc Dự án");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Count total CV sections với dữ liệu
 */
export const getCVCompleteness = (cvData: ICVProfile): {
  completed: number;
  total: number;
  percentage: number;
} => {
  const sections = [
    { name: "personalInfo", filled: !!cvData.personalInfo.fullName },
    { name: "education", filled: cvData.education.length > 0 },
    { name: "experience", filled: cvData.experience.length > 0 },
    { name: "skills", filled: cvData.skills.length > 0 },
    { name: "languages", filled: cvData.languages.length > 0 },
    { name: "projects", filled: cvData.projects.length > 0 },
    { name: "certificates", filled: cvData.certificates.length > 0 },
    { name: "awards", filled: cvData.awards.length > 0 },
  ];

  const completed = sections.filter((s) => s.filled).length;
  const total = sections.length;
  const percentage = Math.round((completed / total) * 100);

  return { completed, total, percentage };
};
