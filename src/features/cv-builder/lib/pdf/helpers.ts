/**
 * PDF Helper Functions
 * Các hàm tiện ích dùng chung cho PDF rendering
 */

/**
 * Format date for display in PDF
 * Handles Date objects, strings, and empty values
 * Empty string or missing date means "Present" (current job/position)
 */
export const formatDateForDisplay = (
  date: Date | string | undefined
): string => {
  if (!date || (typeof date === "string" && date.trim() === "")) {
    return "Present";
  }

  const dateObj = date instanceof Date ? date : new Date(date);

  // new Date() does not throw on bad input; it yields an Invalid Date.
  if (isNaN(dateObj.getTime())) {
    // Text such as "Present" is shown as written.
    return typeof date === "string" ? date : "Present";
  }

  return dateObj.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
  });
};

/**
 * Format gender for display
 */
export const formatGender = (gender?: "male" | "female" | "other"): string => {
  switch (gender) {
    case "male":
      return "Nam";
    case "female":
      return "Nữ";
    case "other":
      return "Khác";
    default:
      return "Chưa cập nhật";
  }
};

/**
 * Get skill level dots count (for visual representation)
 * Used in Modern template for skill level indicators
 */
export const getSkillLevel = (level: string): number => {
  const levelMap: Record<string, number> = {
    Beginner: 1,
    Intermediate: 2,
    Advanced: 3,
    Expert: 4,
    Master: 5,
  };
  return levelMap[level] || 3; // Default to 3 if not found
};

/**
 * Generate a stable hash key from CV data
 * Used to fix "Eo is not a function" bug when data changes
 * Based on solution from: https://github.com/diegomura/react-pdf/issues/3178
 */
export const generateCVDataKey = (cvData: any, template: string): string => {
  const timestamp = cvData.updatedAt || cvData.lastUpdated || Date.now();
  const itemsCount = [
    cvData.education?.length || 0,
    cvData.experience?.length || 0,
    cvData.skills?.length || 0,
    cvData.projects?.length || 0,
  ].join("-");

  return `${template}-${timestamp}-${itemsCount}`;
};
