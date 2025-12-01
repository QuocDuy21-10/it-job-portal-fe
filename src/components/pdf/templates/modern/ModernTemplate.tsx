/**
 * Modern CV Template
 * Two-column layout: Gray sidebar (left) + White content (right)
 */

import React from "react";
import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { ICVProfile } from "@/shared/types/cv";
import { modernStyles } from "@/components/pdf/styles/modern-styles";
import {
  ModernInfoRow,
  ModernSkillItem,
  ModernEducationItem,
  ModernSectionTitle,
  ModernExperienceItem,
  ModernProjectItem,
} from "./ModernComponents";
import { formatDateForDisplay, formatGender } from "@/lib/pdf/helpers";
import { getProxiedImageUrl } from "@/lib/pdf/image-helpers";

interface ModernCVTemplateProps {
  cvData: ICVProfile;
}

/**
 * Modern CV Template Component
 * Professional two-column layout with visual skill indicators
 */
const ModernCVTemplate: React.FC<ModernCVTemplateProps> = ({ cvData }) => {
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
  const avatarUrl = getProxiedImageUrl(personalInfo.avatar);

  return (
    <Document>
      <Page size="A4" style={modernStyles.page}>
        {/* ==================== SIDEBAR (LEFT) ==================== */}
        <View style={modernStyles.sidebar}>
          {/* Header with Avatar */}
          <View style={modernStyles.sidebarHeader}>
            {avatarUrl ? (
              <Image src={avatarUrl} style={modernStyles.sidebarAvatar} />
            ) : (
              <View style={modernStyles.sidebarAvatarPlaceholder}>
                <Text style={{ fontSize: 10, color: "#999999" }}>Avatar</Text>
              </View>
            )}
            <Text style={modernStyles.sidebarName}>
              {personalInfo.fullName || "Họ và Tên"}
            </Text>
            {personalInfo.title && (
              <Text style={modernStyles.sidebarTitle}>{personalInfo.title}</Text>
            )}
          </View>

          {/* Personal Information */}
          <View style={modernStyles.sidebarSection}>
            <ModernSectionTitle title="Thông tin cá nhân" variant="sidebar" />
            <View style={modernStyles.sidebarContent}>
              <ModernInfoRow 
                label="Ngày sinh" 
                value={personalInfo.birthday ? formatDateForDisplay(personalInfo.birthday) : undefined} 
              />
              <ModernInfoRow 
                label="Giới tính" 
                value={formatGender(personalInfo.gender)} 
              />
              <ModernInfoRow 
                label="Điện thoại" 
                value={personalInfo.phone} 
              />
              <ModernInfoRow 
                label="Email" 
                value={personalInfo.email} 
              />
              {personalInfo.address && (
                <ModernInfoRow 
                  label="Địa chỉ" 
                  value={personalInfo.address} 
                />
              )}
              {personalInfo.personalLink && (
                <ModernInfoRow 
                  label="Website" 
                  value={personalInfo.personalLink} 
                />
              )}
            </View>
          </View>

          {/* Skills */}
          {skills.length > 0 && (
            <View style={modernStyles.sidebarSection}>
              <ModernSectionTitle title="Kỹ năng" variant="sidebar" />
              <View style={modernStyles.sidebarContent}>
                {skills.map((skill) => (
                  <ModernSkillItem 
                    key={skill.id} 
                    name={skill.name} 
                    level={skill.level} 
                  />
                ))}
              </View>
            </View>
          )}

          {/* Education */}
          {education.length > 0 && (
            <View style={modernStyles.sidebarSection}>
              <ModernSectionTitle title="Học vấn" variant="sidebar" />
              <View style={modernStyles.sidebarContent}>
                {education.map((edu) => (
                  <ModernEducationItem
                    key={edu.id}
                    school={edu.school}
                    degree={edu.degree}
                    field={edu.field}
                    startDate={edu.startDate}
                    endDate={edu.endDate}
                    description={edu.description}
                  />
                ))}
              </View>
            </View>
          )}
        </View>

        {/* ==================== CONTENT (RIGHT) ==================== */}
        <View style={modernStyles.content}>
          {/* Career Objective / Bio */}
          {personalInfo.bio && (
            <View style={modernStyles.contentSection}>
              <ModernSectionTitle title="Mục tiêu nghề nghiệp" variant="content" />
              <View style={modernStyles.contentSectionBody}>
                <Text style={modernStyles.bioTextModern}>{personalInfo.bio}</Text>
              </View>
            </View>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <View style={modernStyles.contentSection}>
              <ModernSectionTitle title="Kinh nghiệm làm việc" variant="content" />
              <View style={modernStyles.contentSectionBody}>
                {experience.map((exp, idx) => (
                  <React.Fragment key={exp.id}>
                    <ModernExperienceItem
                      company={exp.company}
                      position={exp.position}
                      startDate={exp.startDate}
                      endDate={exp.endDate}
                      description={exp.description}
                    />
                    {experience.length >= 2 && idx < experience.length - 1 && (
                      <View style={modernStyles.experienceItemDivider}></View>
                    )}
                  </React.Fragment>
                ))}
              </View>
            </View>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <View style={modernStyles.contentSection}>
              <ModernSectionTitle title="Dự án" variant="content" />
              <View style={modernStyles.contentSectionBody}>
                {projects.map((project, idx) => (
                  <React.Fragment key={project.id}>
                    <ModernProjectItem
                      name={project.name}
                      position={project.position}
                      description={project.description}
                      link={project.link}
                    />
                    {projects.length >= 2 && idx < projects.length - 1 && (
                      <View style={modernStyles.experienceItemDivider}></View>
                    )}
                  </React.Fragment>
                ))}
              </View>
            </View>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <View style={modernStyles.contentSection}>
              <ModernSectionTitle title="Ngôn ngữ" variant="content" />
              <View style={modernStyles.contentSectionBody}>
                {languages.map((lang, idx) => (
                  <React.Fragment key={lang.id}>
                  <View style={modernStyles.languageItemModern}>
                    <Text style={modernStyles.languageNameModern}>{lang.name}</Text>
                    <Text style={modernStyles.languageProficiencyModern}>{lang.proficiency}</Text>
                  </View>
                   {languages.length >= 2 && idx < languages.length - 1 && (
                      <View style={modernStyles.experienceItemDivider}></View>
                    )}
                  </React.Fragment>
                ))}
              </View>
            </View>
          )}

          {/* Certificates */}
          {certificates.length > 0 && (
            <View style={modernStyles.contentSection}>
              <ModernSectionTitle title="Chứng chỉ" variant="content" />
              <View style={modernStyles.contentSectionBody}>
                {certificates.map((cert, idx) => (
                  <React.Fragment key={cert.id}>
                  <View style={modernStyles.certificateItemModern}>
                    <View style={modernStyles.certificateHeaderModern}>
                      <View style={{ flex: 1 }}>
                        <Text style={modernStyles.certificateNameModern}>{cert.name}</Text>
                        <Text style={modernStyles.certificateIssuerModern}>
                          Tổ chức cấp: {cert.issuer}
                        </Text>
                      </View>
                      <Text style={modernStyles.certificateDateModern}>
                        {formatDateForDisplay(cert.date)}
                      </Text>
                    </View>
                  </View>
                   {certificates.length >= 2 && idx < certificates.length - 1 && (
                      <View style={modernStyles.experienceItemDivider}></View>
                    )}
                  </React.Fragment>
                ))}
              </View>
            </View>
          )}

          {/* Awards */}
          {awards.length > 0 && (
            <View style={modernStyles.contentSection}>
              <ModernSectionTitle title="Danh hiệu & Giải thưởng" variant="content" />
              <View style={modernStyles.contentSectionBody}>
                {awards.map((award, idx) => (
                  <React.Fragment key={award.id}>
                  <View style={modernStyles.awardItemModern}>
                    <View style={modernStyles.awardHeaderModern}>
                      <View style={{ flex: 1 }}>
                        <Text style={modernStyles.awardNameModern}>{award.name}</Text>
                        {award.description && (
                          <Text style={modernStyles.awardDescriptionModern}>{award.description}</Text>
                        )}
                      </View>
                      <Text style={modernStyles.awardDateModern}>
                        {formatDateForDisplay(award.date)}
                      </Text>
                    </View>
                  </View>
                   {awards.length >= 2 && idx < awards.length - 1 && (
                      <View style={modernStyles.experienceItemDivider}></View>
                    )}
                  </React.Fragment>
                ))}
              </View>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default ModernCVTemplate;
