/**
 * Shared CV Styling Constants
 * Đồng bộ style giữa HTML Template và PDF Template
 * Tránh hard-code, dễ maintain
 */

/**
 * Color Palette - Sử dụng cho cả HTML và PDF
 */
export const CVColors = {
  // Text colors
  textPrimary: "#1a1a1a",
  textSecondary: "#555",
  textMuted: "#666",
  textLight: "#7f8c8d",
  textLighter: "#95a5a6",

  // Border colors
  borderPrimary: "#333",
  borderSecondary: "#ddd",
  borderLight: "#ecf0f1",

  // Background colors
  bgWhite: "#ffffff",
  bgGray: "#ecf0f1",
  bgBlue: "#3498db",
  bgGradientStart: "#2563eb", // blue-600
  bgGradientEnd: "#4f46e5",   // indigo-600

  // Section title colors
  sectionTitleClassic: "#2c3e50",
  sectionTitleModern: "#2563eb",

  // Link color
  linkColor: "#3498db",
} as const;

/**
 * Typography - Font sizes
 */
export const CVFontSizes = {
  // Headers
  nameClassic: 24,
  nameModern: 28,
  nameMinimal: 20,

  // Section titles
  sectionTitleClassic: 14,
  sectionTitleModern: 16,
  sectionTitleMinimal: 11,

  // Content
  bodyLarge: 11,
  bodyMedium: 10,
  bodySmall: 9,
  bodyTiny: 8,

  // Item titles
  itemTitle: 11,
  itemSubtitle: 10,
} as const;

/**
 * Spacing & Layout
 */
export const CVSpacing = {
  // Margins
  pageMargin: 40,
  sectionMarginTop: 20,
  itemMarginBottom: 12,
  
  // Paddings
  headerPaddingBottom: 15,
  sectionPaddingBottom: 5,
  tagPaddingHorizontal: 10,
  tagPaddingVertical: 5,

  // Gaps
  contactGap: 12,
  skillGap: 8,
  columnGap: 20,
} as const;

/**
 * Line Heights
 */
export const CVLineHeights = {
  normal: 1.5,
  relaxed: 1.6,
  tight: 1.4,
} as const;

/**
 * Border Widths
 */
export const CVBorderWidths = {
  thin: 1,
  medium: 2,
} as const;

/**
 * Icon sizes for PDF SVG icons
 */
export const CVIconSizes = {
  small: 10,
  medium: 12,
  large: 14,
} as const;

/**
 * Helper function to get Tailwind classes matching PDF styles
 * Dùng cho HTML templates
 */
export const getTailwindClasses = (template: "classic" | "modern" | "minimal") => {
  const base = {
    classic: {
      page: "bg-white text-gray-900 p-8 rounded-lg space-y-6 shadow-lg max-w-4xl mx-auto",
      name: "text-3xl font-bold",
      bio: "text-sm text-gray-600 mt-1",
      contact: "flex flex-wrap gap-4 mt-3 text-sm",
      sectionTitle: "text-lg font-bold border-b border-gray-300 pb-2 mb-3",
      itemTitle: "font-bold",
      itemSubtitle: "text-sm text-gray-600",
      itemDate: "text-sm text-gray-500",
      itemDescription: "text-sm mt-1",
      skillTag: "bg-gray-200 px-3 py-1 rounded text-sm",
    },
    modern: {
      page: "bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-800 p-8 rounded-lg space-y-6 shadow-lg max-w-4xl mx-auto",
      name: "text-4xl font-bold",
      bio: "text-blue-100 mt-2",
      contact: "flex flex-wrap gap-4 mt-4 text-sm",
      sectionTitle: "text-2xl font-bold text-blue-600 mb-4",
      itemTitle: "font-bold text-lg",
      itemSubtitle: "text-sm text-gray-600",
      itemDate: "text-sm text-gray-500",
      itemDescription: "text-sm mt-2",
      skillTag: "bg-white px-3 py-2 rounded-lg text-sm",
    },
    minimal: {
      page: "bg-white text-gray-800 p-8 rounded-lg space-y-6 shadow-lg max-w-4xl mx-auto",
      name: "text-2xl font-light tracking-wide",
      bio: "text-sm text-gray-600 mt-2",
      contact: "flex gap-4 mt-3 text-xs text-gray-600",
      sectionTitle: "text-sm font-bold tracking-widest text-gray-700 mb-4 uppercase",
      itemTitle: "font-bold text-sm",
      itemSubtitle: "text-xs text-gray-600",
      itemDate: "text-xs text-gray-500",
      itemDescription: "text-sm mt-1 text-gray-700",
      skillTag: "text-sm text-gray-700",
    },
  };

  return base[template];
};
