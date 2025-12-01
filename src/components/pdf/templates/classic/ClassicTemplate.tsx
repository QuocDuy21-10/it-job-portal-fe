/**
 * Classic CV Template
 * Traditional, professional, easy-to-read layout
 */

import React from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { ICVProfile } from "@/shared/types/cv";
import { classicStyles } from "@/components/pdf/styles/classic-styles";
import { CVHeader, Section } from "@/components/pdf/shared/common-components";
import { formatDateForDisplay } from "@/lib/pdf/helpers";
import { getProxiedImageUrl } from "@/lib/pdf/image-helpers";

interface ClassicCVTemplateProps {
  cvData: ICVProfile;
}

/**
 * Classic CV Template Component
 * Single-page traditional layout with clear sections
 */
const ClassicCVTemplate: React.FC<ClassicCVTemplateProps> = ({ cvData }) => {
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

  // Use proxied URL to avoid CORS issues
  const personalInfoWithProxiedAvatar = {
    ...personalInfo,
    avatar: getProxiedImageUrl(personalInfo.avatar),
  };

  return (
    <Document>
      <Page size="A4" style={classicStyles.page}>
        {/* Header - Personal Info with Avatar */}
        <CVHeader personalInfo={personalInfoWithProxiedAvatar} />

        {/* Career Objective / Bio */}
        {personalInfo.bio && (
          <Section title="MỤC TIÊU NGHỀ NGHIỆP">
            <Text style={classicStyles.bioText}>
              {personalInfo.bio || "Mục tiêu nghề nghiệp của bạn..."}
            </Text>
          </Section>
        )}

        {/* Education Section */}
        {education.length > 0 && (
          <Section title="HỌC VẤN">
            {education.map((edu) => (
              <View key={edu.id} style={classicStyles.educationItem}>
                <View style={classicStyles.educationHeader}>
                  <View>
                    <Text style={classicStyles.educationSchool}>{edu.school}</Text>
                    <Text style={classicStyles.educationDegree}>
                      {edu.degree} - {edu.field}
                    </Text>
                  </View>
                  <Text style={classicStyles.educationDate}>
                    {formatDateForDisplay(edu.startDate)} - {formatDateForDisplay(edu.endDate)}
                  </Text>
                </View>
                {edu.description && (
                  <Text style={classicStyles.educationDescription}>{edu.description}</Text>
                )}
              </View>
            ))}
          </Section>
        )}

        {/* Skills Section */}
        {skills.length > 0 && (
          <Section title="KỸ NĂNG">
            <View style={classicStyles.skillsGrid}>
              {skills.map((skill) => (
                <Text key={skill.id} style={classicStyles.skillItem}>
                  {skill.name} ({skill.level})
                </Text>
              ))}
            </View>
          </Section>
        )}

        {/* Experience Section */}
        {experience.length > 0 && (
          <Section title="KINH NGHIỆM LÀM VIỆC">
            {experience.map((exp) => (
              <View key={exp.id} style={classicStyles.experienceItem}>
                <View style={classicStyles.experienceHeader}>
                  <View style={classicStyles.experienceLeftContent}>
                    <Text style={classicStyles.experienceCompany}>{exp.company}</Text>
                    <Text style={classicStyles.experiencePosition}>{exp.position}</Text>
                    {exp.description && (
                      <Text style={classicStyles.experienceDescription}>{exp.description}</Text>
                    )}
                  </View>
                  <Text style={classicStyles.experienceDate}>
                    {formatDateForDisplay(exp.startDate)} - {formatDateForDisplay(exp.endDate)}
                  </Text>
                </View>
              </View>
            ))}
          </Section>
        )}

        {/* Projects Section */}
        {projects.length > 0 && (
          <Section title="DỰ ÁN">
            {projects.map((project) => (
              <View key={project.id} style={classicStyles.projectItem}>
                <Text style={classicStyles.projectName}>{project.name}</Text>
                {project.position && (
                  <Text style={classicStyles.projectPosition}>
                    Vị trí: {project.position}
                  </Text>
                )}
                {project.description && (
                  <Text style={classicStyles.projectDescription}>{project.description}</Text>
                )}
                {project.link && (
                  <Text style={classicStyles.projectLink}>Link: {project.link}</Text>
                )}
              </View>
            ))}
          </Section>
        )}

        {/* Certificates Section */}
        {certificates.length > 0 && (
          <Section title="CHỨNG CHỈ">
            {certificates.map((cert) => (
              <View key={cert.id} style={classicStyles.certificateItem}>
                <View style={classicStyles.certificateHeader}>
                  <View style={classicStyles.certificateLeftContent}>
                    <Text style={classicStyles.certificateName}>{cert.name}</Text>
                    <Text style={classicStyles.certificateIssuer}>
                      Tổ chức cấp: {cert.issuer}
                    </Text>
                  </View>
                  <Text style={classicStyles.certificateDate}>
                    {formatDateForDisplay(cert.date)}
                  </Text>
                </View>
              </View>
            ))}
          </Section>
        )}

        {/* Languages Section */}
        {languages.length > 0 && (
          <Section title="NGÔN NGỮ">
            {languages.map((lang) => (
              <Text key={lang.id} style={classicStyles.languageItem}>
                {lang.name} - {lang.proficiency}
              </Text>
            ))}
          </Section>
        )}

        {/* Awards Section */}
        {awards.length > 0 && (
          <Section title="DANH HIỆU & GIẢI THƯỞNG">
            {awards.map((award) => (
              <View key={award.id} style={classicStyles.awardItem}>
                <View style={classicStyles.awardHeader}>
                  <View style={classicStyles.awardLeftContent}>
                    <Text style={classicStyles.awardName}>{award.name}</Text>
                    {award.description && (
                      <Text style={classicStyles.awardDescription}>{award.description}</Text>
                    )}
                  </View>
                  <Text style={classicStyles.awardDate}>
                    {formatDateForDisplay(award.date)}
                  </Text>
                </View>
              </View>
            ))}
          </Section>
        )}
      </Page>
    </Document>
  );
};

export default ClassicCVTemplate;
