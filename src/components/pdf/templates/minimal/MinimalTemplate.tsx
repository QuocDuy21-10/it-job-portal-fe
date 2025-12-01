/**
 * Minimal CV Template
 * Clean, simple, elegant layout with minimal visual elements
 */

import React from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { ICVProfile } from "@/shared/types/cv";
import { minimalStyles } from "@/components/pdf/styles/minimal-styles";
import { formatDateForDisplay } from "@/lib/pdf/helpers";
import { getProxiedImageUrl } from "@/lib/pdf/image-helpers";

interface MinimalCVTemplateProps {
  cvData: ICVProfile;
}

/**
 * Minimal CV Template Component
 * Minimalist single-column layout focused on content
 */
const MinimalCVTemplate: React.FC<MinimalCVTemplateProps> = ({ cvData }) => {
  const { 
    personalInfo, 
    education, 
    experience, 
    skills, 
    languages, 
    projects, 
    certificates, 
    awards 
  } = cvData;

  return (
    <Document>
      <Page size="A4" style={minimalStyles.page}>
        {/* Header */}
        <View style={minimalStyles.header}>
          <Text style={minimalStyles.name}>{personalInfo.fullName || "Họ và Tên"}</Text>
          {personalInfo.title && (
            <Text style={minimalStyles.title}>{personalInfo.title}</Text>
          )}
          <View style={minimalStyles.contactRow}>
            {personalInfo.phone && (
              <Text style={minimalStyles.contactItem}>{personalInfo.phone}</Text>
            )}
            {personalInfo.email && (
              <Text style={minimalStyles.contactItem}>{personalInfo.email}</Text>
            )}
            {personalInfo.address && (
              <Text style={minimalStyles.contactItem}>{personalInfo.address}</Text>
            )}
            {personalInfo.personalLink && (
              <Text style={minimalStyles.contactItem}>{personalInfo.personalLink}</Text>
            )}
          </View>
        </View>

        {/* Bio */}
        {personalInfo.bio && (
          <View style={minimalStyles.section}>
            <Text style={minimalStyles.sectionTitle}>Giới thiệu</Text>
            <View style={minimalStyles.sectionContent}>
              <Text style={minimalStyles.bioText}>{personalInfo.bio}</Text>
            </View>
          </View>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <View style={minimalStyles.section}>
            <Text style={minimalStyles.sectionTitle}>Kinh nghiệm làm việc</Text>
            <View style={minimalStyles.sectionContent}>
              {experience.map((exp) => (
                <View key={exp.id} style={minimalStyles.experienceItem}>
                  <View style={minimalStyles.experienceHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={minimalStyles.experienceCompany}>{exp.company}</Text>
                      <Text style={minimalStyles.experiencePosition}>{exp.position}</Text>
                    </View>
                    <Text style={minimalStyles.experienceDate}>
                      {formatDateForDisplay(exp.startDate)} - {formatDateForDisplay(exp.endDate)}
                    </Text>
                  </View>
                  {exp.description && (
                    <Text style={minimalStyles.experienceDescription}>{exp.description}</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Education */}
        {education.length > 0 && (
          <View style={minimalStyles.section}>
            <Text style={minimalStyles.sectionTitle}>Học vấn</Text>
            <View style={minimalStyles.sectionContent}>
              {education.map((edu) => (
                <View key={edu.id} style={minimalStyles.educationItem}>
                  <View style={minimalStyles.educationHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={minimalStyles.educationSchool}>{edu.school}</Text>
                      <Text style={minimalStyles.educationDegree}>
                        {edu.degree} - {edu.field}
                      </Text>
                    </View>
                    <Text style={minimalStyles.educationDate}>
                      {formatDateForDisplay(edu.startDate)} - {formatDateForDisplay(edu.endDate)}
                    </Text>
                  </View>
                  {edu.description && (
                    <Text style={minimalStyles.educationDescription}>{edu.description}</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <View style={minimalStyles.section}>
            <Text style={minimalStyles.sectionTitle}>Kỹ năng</Text>
            <View style={minimalStyles.sectionContent}>
              <View style={minimalStyles.skillsContainer}>
                {skills.map((skill) => (
                  <Text key={skill.id} style={minimalStyles.skillItem}>
                    {skill.name} ({skill.level})
                  </Text>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <View style={minimalStyles.section}>
            <Text style={minimalStyles.sectionTitle}>Dự án</Text>
            <View style={minimalStyles.sectionContent}>
              {projects.map((project) => (
                <View key={project.id} style={minimalStyles.projectItem}>
                  <Text style={minimalStyles.projectName}>{project.name}</Text>
                  {project.position && (
                    <Text style={minimalStyles.projectPosition}>
                      Vị trí: {project.position}
                    </Text>
                  )}
                  <Text style={minimalStyles.projectDescription}>{project.description}</Text>
                  {project.link && (
                    <Text style={minimalStyles.projectLink}>Link: {project.link}</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <View style={minimalStyles.section}>
            <Text style={minimalStyles.sectionTitle}>Ngôn ngữ</Text>
            <View style={minimalStyles.sectionContent}>
              {languages.map((lang) => (
                <Text key={lang.id} style={minimalStyles.languageItem}>
                  {lang.name} - {lang.proficiency}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Certificates */}
        {certificates.length > 0 && (
          <View style={minimalStyles.section}>
            <Text style={minimalStyles.sectionTitle}>Chứng chỉ</Text>
            <View style={minimalStyles.sectionContent}>
              {certificates.map((cert) => (
                <View key={cert.id} style={minimalStyles.certificateItem}>
                  <View style={minimalStyles.certificateHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={minimalStyles.certificateName}>{cert.name}</Text>
                      <Text style={minimalStyles.certificateIssuer}>
                        Tổ chức cấp: {cert.issuer}
                      </Text>
                    </View>
                    <Text style={minimalStyles.certificateDate}>
                      {formatDateForDisplay(cert.date)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Awards */}
        {awards.length > 0 && (
          <View style={minimalStyles.section}>
            <Text style={minimalStyles.sectionTitle}>Danh hiệu & Giải thưởng</Text>
            <View style={minimalStyles.sectionContent}>
              {awards.map((award) => (
                <View key={award.id} style={minimalStyles.awardItem}>
                  <View style={minimalStyles.awardHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={minimalStyles.awardName}>{award.name}</Text>
                      {award.description && (
                        <Text style={minimalStyles.awardDescription}>{award.description}</Text>
                      )}
                    </View>
                    <Text style={minimalStyles.awardDate}>
                      {formatDateForDisplay(award.date)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default MinimalCVTemplate;
