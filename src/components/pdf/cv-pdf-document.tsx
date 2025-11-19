/**
 * CV PDF Document Component
 * Sử dụng @react-pdf/renderer để tạo PDF template
 * 
 * LƯU Ý QUAN TRỌNG:
 * 1. Chỉ sử dụng: Document, Page, View, Text, Image, Link
 * 2. KHÔNG dùng: div, span, p, h1, button, etc.
 * 3. Styling: Chỉ hỗ trợ Flexbox cơ bản, không có grid/z-index/box-shadow
 * 4. Font: Phải register .ttf fonts cho tiếng Việt
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


interface CVPdfDocumentProps {
  cvData: ICVProfile;
  template?: "classic" | "modern" | "minimal";
}

registerFonts();

// Styles cho PDF - Chỉ dùng Flexbox
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Roboto",
    fontSize: 10,
    lineHeight: 1.5,
  },
  header: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: "2 solid #333",
  },
  name: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 8,
    color: "#1a1a1a",
  },
  bio: {
    fontSize: 11,
    color: "#555",
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    fontSize: 9,
    color: "#666",
  },
  contactItem: {
    marginRight: 12,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 10,
    paddingBottom: 5,
    borderBottom: "1 solid #ddd",
    color: "#2c3e50",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  itemContainer: {
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: "#2c3e50",
  },
  itemSubtitle: {
    fontSize: 10,
    color: "#7f8c8d",
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 9,
    color: "#95a5a6",
  },
  itemDescription: {
    fontSize: 10,
    color: "#555",
    lineHeight: 1.6,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillTag: {
    backgroundColor: "#ecf0f1",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 3,
    fontSize: 9,
  },
  twoColumns: {
    flexDirection: "row",
    gap: 20,
  },
  column: {
    flex: 1,
  },
});

/**
 * Helper function to format date for display
 * Empty string means "Present" (current job/position)
 */
const formatDateForDisplay = (date: string): string => {
  if (!date || date.trim() === "") {
    return "Present";
  }
  return date;
};

/**
 * Classic CV Template
 * Template truyền thống, rõ ràng, dễ đọ
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
          <View style={styles.contactRow}>
            {personalInfo.email && <Text style={styles.contactItem}>📧 {personalInfo.email}</Text>}
            {personalInfo.phone && <Text style={styles.contactItem}>📱 {personalInfo.phone}</Text>}
            {personalInfo.address && <Text style={styles.contactItem}>📍 {personalInfo.address}</Text>}
            {personalInfo.birthday && <Text style={styles.contactItem}>🎂 {personalInfo.birthday}</Text>}
            {personalInfo.gender && <Text style={styles.contactItem}>👤 {personalInfo.gender}</Text>}
          </View>
          {personalInfo.personalLink && (
            <Text style={{ fontSize: 9, color: "#3498db", marginTop: 4 }}>
              🔗 {personalInfo.personalLink}
            </Text>
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
                  <Text style={styles.itemDate}>{edu.endDate}</Text>
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
                  <Text style={{ fontSize: 9, color: "#3498db", marginTop: 2 }}>
                    {project.link}
                  </Text>
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
                  <Text style={styles.itemDate}>{cert.date}</Text>
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
                  <Text style={styles.itemDate}>{award.date}</Text>
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
