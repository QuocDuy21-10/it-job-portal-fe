/**
 * Modern Template Styles
 * Two-column layout: Gray sidebar (left) + White content (right)
 */

import { StyleSheet } from "@react-pdf/renderer";

export const modernStyles = StyleSheet.create({
  // === PAGE LAYOUT ===
  page: {
    flexDirection: "row",
    fontFamily: "Roboto",
    fontSize: 10, 
    lineHeight: 1.5,
  },

  experienceItemDivider: {
    borderBottom: "1 solid #2F4F4F",
  },

  // === SIDEBAR (LEFT COLUMN) ===
  sidebar: {
    width: "35%",
    backgroundColor: "#E9ECEC",
    padding: 20,
    gap: 16,
  },
  sidebarHeader: {
    alignItems: "center",
    marginBottom: 12,
  },
  sidebarAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
    objectFit: "cover",
  },
  sidebarAvatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#CCCCCC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  sidebarName: {
    fontSize: 16,
    fontWeight: 700,
    color: "#2F4F4F",
    textAlign: "center",
    marginBottom: 4,
  },
  sidebarTitle: {
    fontSize: 11,
    fontWeight: 600,
    color: "#666666",
    textAlign: "center",
  },

  // === SIDEBAR SECTION ===
  sidebarSection: {
    marginBottom: 14,
  },
  sidebarSectionTitle: {
    backgroundColor: "#2F4F4F",
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: 700,
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sidebarContent: {
    gap: 2,
    paddingHorizontal: 10,
  },

  // === SIDEBAR INFO ROW ===
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 2,
    marginBottom: 1,
  },
  infoLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: "#2F4F4F",
    width: 70,
  },
  infoValue: {
    fontSize: 9,
    color: "#000000",
    flex: 1,
  },

  // === SIDEBAR SKILL ITEM ===
  skillItemModern: {
    marginBottom: 2,
  },
  skillName: {
    fontSize: 9,
    fontWeight: 600,
    color: "#333333",
    marginBottom: 2,
  },
  skillLevelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  skillLevelBar: {
    flexDirection: "row",
    gap: 2,
  },
  skillLevelDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2F4F4F",
  },
  skillLevelDotEmpty: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#CCCCCC",
  },
  skillLevelText: {
    fontSize: 7,
    color: "#666666",
  },

  // === SIDEBAR EDUCATION ITEM ===
  educationItemModern: {
    marginBottom: 10,
  },
  educationSchoolModern: {
    fontSize: 9,
    fontWeight: 700,
    color: "#2F4F4F",
    marginBottom: 2,
  },
  educationDegreeModern: {
    fontSize: 8,
    color: "#333333",
    marginBottom: 2,
  },
  educationDateModern: {
    fontSize: 7,
    color: "#666666",
    fontStyle: "italic",
    marginBottom: 2,
  },
  educationDescriptionModern: {
    fontSize: 7,
    color: "#666666",
    lineHeight: 1.4,
    textAlign: "justify",
    wordBreak: "break-word",
    width: "100%",
  },

  // === CONTENT (RIGHT COLUMN) ===
  content: {
    width: "65%",
    backgroundColor: "#FFFFFF",
    padding: 20,
    gap: 14,
  },

  // === CONTENT SECTION ===
  contentSection: {
    marginBottom: 12,
    paddingRight: 20,
  },
  contentSectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    backgroundColor: "#2F4F4F",
    color: "#FFFFFF",
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  contentSectionBody: {
    flexDirection: "column",
    gap: 10,
    width: "100%",
  },

  // === BIO ===
  bioTextModern: {
    fontSize: 9,
    color: "#333333",
    lineHeight: 1.6,
    textAlign: "justify",
    wordBreak: "break-word",
    width: "100%",
  },

  // === EXPERIENCE ITEM ===
  experienceItemModern: {
    marginBottom: 10,
  },
  experienceHeaderModern: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  experienceCompanyModern: {
    fontSize: 10,
    fontWeight: 700,
    color: "#2F4F4F",
  },
  experiencePositionModern: {
    fontSize: 9,
    fontWeight: 600,
    color: "#333333",
    marginBottom: 3,
  },
  experienceDateModern: {
    fontSize: 8,
    color: "#666666",
    fontStyle: "italic",
  },
  experienceDescriptionModern: {
    fontSize: 8,
    color: "#333333",
    lineHeight: 1.5,
    textAlign: "justify",
    wordBreak: "break-word",
    width: "100%",
  },

  // === PROJECT ITEM ===
  projectItemModern: {
    marginBottom: 2,
  },
  projectNameModern: {
    fontSize: 10,
    fontWeight: 700,
    color: "#2F4F4F",
    marginBottom: 2,
  },
  projectPositionModern: {
    fontSize: 8,
    fontWeight: 600,
    color: "#666666",
    marginBottom: 2,
  },
  projectDescriptionModern: {
    fontSize: 8,
    color: "#333333",
    lineHeight: 1.5,
    marginBottom: 2,
    textAlign: "justify",
    wordBreak: "break-word",
    width: "100%",
  },
  projectLinkModern: {
    fontSize: 8,
    color: "#2F4F4F",
    fontStyle: "italic",
  },

  // === LANGUAGE ITEM ===
  languageItemModern: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    paddingVertical: 3,
  },
  languageNameModern: {
    fontSize: 9,
    fontWeight: 600,
    color: "#333333",
  },
  languageProficiencyModern: {
    fontSize: 8,
    color: "#666666",
    fontStyle: "italic",
  },

  // === CERTIFICATE ITEM ===
  certificateItemModern: {
    marginBottom: 8,
  },
  certificateHeaderModern: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  certificateNameModern: {
    fontSize: 9,
    fontWeight: 700,
    color: "#2F4F4F",
  },
  certificateIssuerModern: {
    fontSize: 8,
    color: "#333333",
  },
  certificateDateModern: {
    fontSize: 8,
    color: "#666666",
    fontStyle: "italic",
  },

  // === AWARD ITEM ===
  awardItemModern: {
    marginBottom: 8,
  },
  awardHeaderModern: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  awardNameModern: {
    fontSize: 9,
    fontWeight: 700,
    color: "#2F4F4F",
  },
  awardDescriptionModern: {
    fontSize: 8,
    color: "#333333",
    lineHeight: 1.5,
    textAlign: "justify",
    wordBreak: "break-word",
    width: "100%",
  },
  awardDateModern: {
    fontSize: 8,
    color: "#666666",
    fontStyle: "italic",
  },
});
