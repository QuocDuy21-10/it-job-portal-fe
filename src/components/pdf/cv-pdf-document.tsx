/**
 * CV PDF Document Component
 * Sử dụng @react-pdf/renderer để tạo PDF template
 * 
 * LƯU Ý QUAN TRỌNG:
 * 1. Chỉ sử dụng: Document, Page, View, Text, Image, Link, Svg
 * 2. KHÔNG dùng: div, span, p, h1, button, etc.
 * 3. Styling: Chỉ hỗ trợ Flexbox cơ bản, không có grid/z-index/box-shadow
 * 4. Font: Phải register .ttf fonts cho tiếng Việt
 * 5. Icons: Dùng SVG primitives từ icons.tsx
 */

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { ICVProfile } from "@/shared/types/cv";
import { registerFonts } from '@/lib/pdf/fonts';
import {
  EmailIcon,
  PhoneIcon,
  LocationIcon,
  CalendarIcon,
  UserIcon,
  LinkIcon,
} from "@/components/pdf/icons";
import {
  CVColors,
  CVFontSizes,
  CVSpacing,
  CVLineHeights,
  CVBorderWidths,
} from "@/lib/pdf/cv-styles";


interface CVPdfDocumentProps {
  cvData: ICVProfile;
  template?: "classic" | "modern" | "minimal";
}

registerFonts();

// Styles cho PDF - Sử dụng shared constants
const styles = StyleSheet.create({
  page: {
    padding: CVSpacing.pageMargin,
    fontFamily: "Roboto",
    fontSize: CVFontSizes.bodyMedium,
    lineHeight: CVLineHeights.normal,
  },
  header: {
    marginBottom: CVSpacing.sectionMarginTop,
    paddingBottom: CVSpacing.headerPaddingBottom,
    borderBottom: `${CVBorderWidths.medium} solid ${CVColors.borderPrimary}`,
  },
  name: {
    fontSize: CVFontSizes.nameClassic,
    fontWeight: 700,
    marginBottom: 8,
    color: CVColors.textPrimary,
  },
  bio: {
    fontSize: CVFontSizes.bodyLarge,
    color: CVColors.textSecondary,
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: CVSpacing.contactGap,
    fontSize: CVFontSizes.bodySmall,
    color: CVColors.textMuted,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  personalLink: {
    fontSize: CVFontSizes.bodySmall,
    color: CVColors.linkColor,
    marginTop: 4,
  },
  section: {
    marginTop: CVSpacing.sectionMarginTop,
  },
  sectionTitle: {
    fontSize: CVFontSizes.sectionTitleClassic,
    fontWeight: 700,
    marginBottom: 10,
    paddingBottom: CVSpacing.sectionPaddingBottom,
    borderBottom: `${CVBorderWidths.thin} solid ${CVColors.borderSecondary}`,
    color: CVColors.sectionTitleClassic,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  itemContainer: {
    marginBottom: CVSpacing.itemMarginBottom,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: CVFontSizes.itemTitle,
    fontWeight: 700,
    color: CVColors.sectionTitleClassic,
  },
  itemSubtitle: {
    fontSize: CVFontSizes.itemSubtitle,
    color: CVColors.textLight,
    marginBottom: 4,
  },
  itemDate: {
    fontSize: CVFontSizes.bodySmall,
    color: CVColors.textLighter,
  },
  itemDescription: {
    fontSize: CVFontSizes.bodyMedium,
    color: CVColors.textSecondary,
    lineHeight: CVLineHeights.relaxed,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: CVSpacing.skillGap,
  },
  skillTag: {
    backgroundColor: CVColors.borderLight,
    paddingHorizontal: CVSpacing.tagPaddingHorizontal,
    paddingVertical: CVSpacing.tagPaddingVertical,
    borderRadius: 3,
    fontSize: CVFontSizes.bodySmall,
  },
  twoColumns: {
    flexDirection: "row",
    gap: CVSpacing.columnGap,
  },
  column: {
    flex: 1,
  },
  linkText: {
    fontSize: CVFontSizes.bodySmall,
    color: CVColors.linkColor,
    marginTop: 2,
  },
});

/**
 * Helper function to format date for display
 * Handles Date objects, strings, and empty values
 * Empty string or missing date means "Present" (current job/position)
 */
const formatDateForDisplay = (date: Date | string | undefined): string => {
  if (!date) {
    return "Present";
  }
  
  // If it's a Date object, convert to localized string
  if (date instanceof Date) {
    return date.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' });
  }
  
  // If it's an empty string, show "Present"
  if (typeof date === 'string' && date.trim() === "") {
    return "Present";
  }
  
  // If it's a date string, format it
  if (typeof date === 'string') {
    try {
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' });
    } catch {
      return date;
    }
  }
  
  return String(date);
};

/**
 * Classic CV Template
 * Template truyền thống, rõ ràng, dễ đọc
 * Sử dụng SVG icons và shared constants
 */
const ClassicCVTemplate: React.FC<{ cvData: ICVProfile }> = ({ cvData }) => {
  const { personalInfo, education, experience, skills, languages, projects, certificates, awards } = cvData;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header - Personal Info */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.fullName}</Text>
          {personalInfo.bio && <Text style={styles.bio}>{personalInfo.bio}</Text>}
          
          {/* Contact Information with Icons */}
          <View style={styles.contactRow}>
            {personalInfo.email && (
              <View style={styles.contactItem}>
                <EmailIcon size={10} color={CVColors.textMuted} />
                <Text>{personalInfo.email}</Text>
              </View>
            )}
            {personalInfo.phone && (
              <View style={styles.contactItem}>
                <PhoneIcon size={10} color={CVColors.textMuted} />
                <Text>{personalInfo.phone}</Text>
              </View>
            )}
            {personalInfo.address && (
              <View style={styles.contactItem}>
                <LocationIcon size={10} color={CVColors.textMuted} />
                <Text>{personalInfo.address}</Text>
              </View>
            )}
            {personalInfo.birthday && (
              <View style={styles.contactItem}>
                <CalendarIcon size={10} color={CVColors.textMuted} />
                <Text>{formatDateForDisplay(personalInfo.birthday)}</Text>
              </View>
            )}
            {personalInfo.gender && (
              <View style={styles.contactItem}>
                <UserIcon size={10} color={CVColors.textMuted} />
                <Text>{personalInfo.gender}</Text>
              </View>
            )}
          </View>
          
          {personalInfo.personalLink && (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
              <LinkIcon size={10} color={CVColors.linkColor} />
              <Text style={styles.personalLink}>{personalInfo.personalLink}</Text>
            </View>
          )}
        </View>

        {/* Experience Section */}
        {experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kinh nghiệm làm việc</Text>
            {experience.map((exp) => (
              <View key={exp.id} style={styles.itemContainer}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{exp.position}</Text>
                  <Text style={styles.itemDate}>
                    {formatDateForDisplay(exp.startDate)} - {formatDateForDisplay(exp.endDate)}
                  </Text>
                </View>
                <Text style={styles.itemSubtitle}>{exp.company}</Text>
                {exp.description && (
                  <Text style={styles.itemDescription}>{exp.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education Section */}
        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Học vấn</Text>
            {education.map((edu) => (
              <View key={edu.id} style={styles.itemContainer}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{edu.school}</Text>
                  <Text style={styles.itemDate}>
                    {formatDateForDisplay(edu.startDate)} - {formatDateForDisplay(edu.endDate)}
                  </Text>
                </View>
                <Text style={styles.itemSubtitle}>
                  {edu.degree} - {edu.field}
                </Text>
                {edu.description && (
                  <Text style={styles.itemDescription}>{edu.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills & Languages - Two Columns */}
        {(skills.length > 0 || languages.length > 0) && (
          <View style={styles.twoColumns}>
            {/* Skills */}
            {skills.length > 0 && (
              <View style={styles.column}>
                <Text style={styles.sectionTitle}>Kỹ năng</Text>
                <View style={styles.skillsContainer}>
                  {skills.map((skill) => (
                    <View key={skill.id} style={styles.skillTag}>
                      <Text>{skill.name} ({skill.level})</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <View style={styles.column}>
                <Text style={styles.sectionTitle}>Ngôn ngữ</Text>
                <View style={styles.skillsContainer}>
                  {languages.map((lang) => (
                    <View key={lang.id} style={styles.skillTag}>
                      <Text>{lang.name} ({lang.proficiency})</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        {/* Projects Section */}
        {projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dự án</Text>
            {projects.map((project) => (
              <View key={project.id} style={styles.itemContainer}>
                <Text style={styles.itemTitle}>{project.name}</Text>
                {project.description && (
                  <Text style={styles.itemDescription}>{project.description}</Text>
                )}
                {project.link && (
                  <Text style={styles.linkText}>{project.link}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Certificates Section */}
        {certificates.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chứng chỉ</Text>
            {certificates.map((cert) => (
              <View key={cert.id} style={styles.itemContainer}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{cert.name}</Text>
                  <Text style={styles.itemDate}>{formatDateForDisplay(cert.date)}</Text>
                </View>
                <Text style={styles.itemSubtitle}>{cert.issuer}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Awards Section */}
        {awards.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Giải thưởng</Text>
            {awards.map((award) => (
              <View key={award.id} style={styles.itemContainer}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{award.name}</Text>
                  <Text style={styles.itemDate}>{formatDateForDisplay(award.date)}</Text>
                </View>
                {award.description && (
                  <Text style={styles.itemDescription}>{award.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

/**
 * Main CV PDF Document Component
 */
const CVPdfDocument: React.FC<CVPdfDocumentProps> = ({ cvData, template = "classic" }) => {
  // Hiện tại chỉ có classic template, có thể mở rộng thêm modern/minimal
  return <ClassicCVTemplate cvData={cvData} />;
};

export default CVPdfDocument;
