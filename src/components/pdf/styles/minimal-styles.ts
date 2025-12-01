/**
 * Minimal Template Styles
 * Clean, simple, elegant layout with minimal visual elements
 */

import { StyleSheet } from "@react-pdf/renderer";
import { CVColors } from "@/lib/pdf/cv-styles";

export const minimalStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Roboto",
    fontSize: 10,
    lineHeight: 1.5,
    backgroundColor: "#FFFFFF",
  },

  // === HEADER ===
  header: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottom: "1 solid #CCCCCC",
  },
  name: {
    fontSize: 20,
    fontWeight: 300,
    color: "#2C3E50",
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  title: {
    fontSize: 11,
    fontWeight: 400,
    color: "#7F8C8D",
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    fontSize: 9,
    color: "#7F8C8D",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  // === SECTION ===
  section: {
    marginTop: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: "#2C3E50",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  sectionContent: {
    gap: 10,
  },

  // === BIO ===
  bioText: {
    fontSize: 9,
    color: "#555555",
    lineHeight: 1.6,
    textAlign: "justify",
  },

  // === EDUCATION ===
  educationItem: {
    marginBottom: 10,
  },
  educationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  educationSchool: {
    fontSize: 10,
    fontWeight: 700,
    color: "#2C3E50",
  },
  educationDegree: {
    fontSize: 9,
    color: "#555555",
    marginBottom: 2,
  },
  educationDate: {
    fontSize: 8,
    color: "#95A5A6",
    fontStyle: "italic",
  },
  educationDescription: {
    fontSize: 8,
    color: "#7F8C8D",
    lineHeight: 1.4,
  },

  // === SKILLS ===
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  skillItem: {
    fontSize: 9,
    color: "#555555",
  },

  // === EXPERIENCE ===
  experienceItem: {
    marginBottom: 10,
  },
  experienceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  experienceCompany: {
    fontSize: 10,
    fontWeight: 700,
    color: "#2C3E50",
  },
  experiencePosition: {
    fontSize: 9,
    fontWeight: 600,
    color: "#555555",
    marginBottom: 2,
  },
  experienceDate: {
    fontSize: 8,
    color: "#95A5A6",
    fontStyle: "italic",
  },
  experienceDescription: {
    fontSize: 8,
    color: "#7F8C8D",
    lineHeight: 1.5,
  },

  // === PROJECTS ===
  projectItem: {
    marginBottom: 10,
  },
  projectName: {
    fontSize: 10,
    fontWeight: 700,
    color: "#2C3E50",
    marginBottom: 2,
  },
  projectPosition: {
    fontSize: 8,
    fontWeight: 600,
    color: "#7F8C8D",
    marginBottom: 2,
  },
  projectDescription: {
    fontSize: 8,
    color: "#7F8C8D",
    lineHeight: 1.5,
  },
  projectLink: {
    fontSize: 8,
    color: "#3498DB",
    marginTop: 2,
  },

  // === LANGUAGES ===
  languageItem: {
    fontSize: 9,
    color: "#555555",
    marginBottom: 4,
  },

  // === CERTIFICATES ===
  certificateItem: {
    marginBottom: 8,
  },
  certificateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  certificateName: {
    fontSize: 9,
    fontWeight: 700,
    color: "#2C3E50",
  },
  certificateIssuer: {
    fontSize: 8,
    color: "#555555",
  },
  certificateDate: {
    fontSize: 8,
    color: "#95A5A6",
    fontStyle: "italic",
  },

  // === AWARDS ===
  awardItem: {
    marginBottom: 8,
  },
  awardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  awardName: {
    fontSize: 9,
    fontWeight: 700,
    color: "#2C3E50",
  },
  awardDate: {
    fontSize: 8,
    color: "#95A5A6",
    fontStyle: "italic",
  },
  awardDescription: {
    fontSize: 8,
    color: "#7F8C8D",
    lineHeight: 1.5,
  },
});
