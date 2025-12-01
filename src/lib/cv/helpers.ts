/**
 * CV Helper Functions
 * Shared utilities for CV templates
 */

/**
 * Format date for display in CV templates
 * Empty string or undefined means "Present" (current position)
 */
export const formatDateDisplay = (date: string | Date | undefined): string => {
  if (!date || (typeof date === "string" && date.trim() === "")) {
    return "Hiện tại";
  }
  if (date instanceof Date) {
    return date.toLocaleDateString("vi-VN", { month: "2-digit", year: "numeric" });
  }
  return date;
};

/**
 * Format gender for display
 */
export const formatGender = (gender?: "male" | "female" | "other"): string => {
  if (!gender) return "";
  const genderMap = {
    male: "Nam",
    female: "Nữ",
    other: "Khác",
  };
  return genderMap[gender] || "";
};

/**
 * Get skill level percentage for progress bars
 */
export const getSkillLevelPercentage = (level: string): string => {
  const levelMap: Record<string, string> = {
    Beginner: "25%",
    Intermediate: "50%",
    Advanced: "75%",
    Expert: "100%",
  };
  return levelMap[level] || "50%";
};
