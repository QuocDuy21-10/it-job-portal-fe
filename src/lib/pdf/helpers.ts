/**
 * PDF Helper Functions
 * Các hàm tiện ích dùng chung cho PDF rendering
 */

/**
 * Format date for display in PDF
 * Handles Date objects, strings, and empty values
 * Empty string or missing date means "Present" (current job/position)
 */
export const formatDateForDisplay = (date: Date | string | undefined): string => {
  if (!date) {
    return "Present";
  }
  
  // If it's a Date object, convert to localized string
  if (date instanceof Date) {
    return date.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit' });
  }
  
  // If it's an empty string, show "Present"
  if (typeof date === 'string' && date.trim() === "") {
    return "Present";
  }
  
  // If it's a date string, format it
  if (typeof date === 'string') {
    try {
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit' });
    } catch {
      return date;
    }
  }
  
  return String(date);
};

/**
 * Format gender for display
 */
export const formatGender = (gender?: "male" | "female" | "other"): string => {
  switch (gender) {
    case "male": return "Nam";
    case "female": return "Nữ";
    case "other": return "Khác";
    default: return "Chưa cập nhật";
  }
};

/**
 * Get skill level dots count (for visual representation)
 * Used in Modern template for skill level indicators
 */
export const getSkillLevel = (level: string): number => {
  const levelMap: Record<string, number> = {
    "Beginner": 1,
    "Intermediate": 2,
    "Advanced": 3,
    "Expert": 4,
    "Master": 5,
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
  ].join('-');
  
  return `${template}-${timestamp}-${itemsCount}`;
};
