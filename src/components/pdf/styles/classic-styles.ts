/**
 * Classic Template Styles
 * Traditional, clean, professional CV layout
 */

import { StyleSheet } from "@react-pdf/renderer";
import {
  CVColors,
  CVFontSizes,
  CVSpacing,
  CVLineHeights,
  CVBorderWidths,
} from "@/lib/pdf/cv-styles";

export const classicStyles = StyleSheet.create({
  page: {
    padding: CVSpacing.pageMargin,
    fontFamily: "Roboto",
    fontSize: CVFontSizes.bodyMedium,
    lineHeight: CVLineHeights.normal,
  },
  
  // === HEADER STYLES ===
  header: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 10,
    paddingBottom: 0,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    flexShrink: 0,
  },
  avatar: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: CVColors.borderLight,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarPlaceholderText: {
    fontSize: 10,
    color: CVColors.textMuted,
  },
  headerInfo: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 22,
    fontWeight: 700,
    color: CVColors.textPrimary,
    marginBottom: 10,
  },
  title: {
    fontSize: 13,
    fontWeight: 600,
    color: CVColors.textSecondary,
    marginBottom: 8,
  },
  contactGrid: {
    gap: 6,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    fontSize: 10,
    color: CVColors.textMuted,
  },
  contactLabel: {
    width: 80,
    fontSize: 9,
    color: CVColors.textLight,
    fontWeight: 600,
  },
  contactValue: {
    flex: 1,
    fontSize: 10,
    color: CVColors.textPrimary,
  },
  contactPlaceholder: {
    flex: 1,
    fontSize: 10,
    color: CVColors.textLighter,
    fontStyle: "italic",
  },

  // === SECTION STYLES ===
  section: {
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottom: `${CVBorderWidths.medium} solid ${CVColors.borderPrimary}`,
    color: CVColors.textPrimary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  sectionContent: {
    paddingTop: 8,
    gap: 12,
  },

  // === BIO/OBJECTIVE STYLES ===
  bioText: {
    fontSize: 10,
    color: CVColors.textSecondary,
    lineHeight: 1.6,
  },

  // === EDUCATION STYLES ===
  educationItem: {
    marginBottom: 10,
  },
  educationHeader: {
    flexDirection: "row",
    marginBottom: 3,
    justifyContent: "space-between",
    alignItems: "center",
  },
  educationDate: {
    fontSize: 9,
    color: CVColors.textLight,
    fontWeight: 600,
    textAlign: "right",
    minWidth: 90,
  },
  educationSchool: {
    fontSize: 11,
    fontWeight: 700,
    color: CVColors.textPrimary,
    marginBottom: 2,
  },
  educationDegree: {
    fontSize: 10,
    color: CVColors.textSecondary,
    marginBottom: 3,
  },
  educationDescription: {
    fontSize: 9,
    color: CVColors.textLight,
    lineHeight: 1.5,
  },

  // === SKILLS STYLES ===
  skillsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  skillItem: {
    fontSize: 9,
    color: CVColors.textPrimary,
    backgroundColor: CVColors.borderLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 3,
  },

  // === EXPERIENCE STYLES ===
  experienceItem: {
    marginBottom: 12,
  },
  experienceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 3,
  },
  experienceLeftContent: {
    flex: 1,
    paddingRight: 8,
  },
  experienceDate: {
    fontSize: 9,
    color: CVColors.textLight,
    fontWeight: 600,
    textAlign: "right",
    minWidth: 90,
  },
  experienceCompany: {
    fontSize: 11,
    fontWeight: 700,
    color: CVColors.textPrimary,
    marginBottom: 2,
  },
  experiencePosition: {
    fontSize: 10,
    color: CVColors.textSecondary,
    fontWeight: 600,
    marginBottom: 3,
  },
  experienceDescription: {
    fontSize: 9,
    color: CVColors.textLight,
    lineHeight: 1.5,
  },

  // === PROJECT STYLES ===
  projectItem: {
    marginBottom: 10,
  },
  projectName: {
    fontSize: 11,
    fontWeight: 700,
    color: CVColors.textPrimary,
    marginBottom: 2,
  },
  projectPosition: {
    fontSize: 10,
    color: CVColors.textSecondary,
    fontWeight: 600,
    marginBottom: 3,
  },
  projectDescription: {
    fontSize: 9,
    color: CVColors.textLight,
    lineHeight: 1.5,
    marginBottom: 3,
  },
  projectLink: {
    fontSize: 9,
    color: CVColors.linkColor,
  },

  // === CERTIFICATE STYLES ===
  certificateItem: {
    marginBottom: 8,
  },
  certificateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  certificateLeftContent: {
    flex: 1,
    paddingRight: 8,
  },
  certificateDate: {
    fontSize: 9,
    color: CVColors.textLight,
    fontWeight: 600,
    textAlign: "right",
    minWidth: 90,
  },
  certificateName: {
    fontSize: 10,
    fontWeight: 700,
    color: CVColors.textPrimary,
    marginBottom: 2,
  },
  certificateIssuer: {
    fontSize: 9,
    color: CVColors.textSecondary,
  },

  // === LANGUAGE STYLES ===
  languageItem: {
    fontSize: 10,
    color: CVColors.textPrimary,
    marginBottom: 4,
  },

  // === AWARD STYLES ===
  awardItem: {
    marginBottom: 8,
  },
  awardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  awardLeftContent: {
    flex: 1,
    paddingRight: 8,
  },
  awardDate: {
    fontSize: 9,
    color: CVColors.textLight,
    fontWeight: 600,
    textAlign: "right",
    minWidth: 90,
  },
  awardName: {
    fontSize: 10,
    fontWeight: 700,
    color: CVColors.textPrimary,
    marginBottom: 2,
  },
  awardDescription: {
    fontSize: 9,
    color: CVColors.textLight,
    lineHeight: 1.5,
  },
});
