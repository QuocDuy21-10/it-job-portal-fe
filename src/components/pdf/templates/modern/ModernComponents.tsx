/**
 * Modern Template Components
 * Reusable sub-components for Modern CV Template
 */

import React from "react";
import { Text, View } from "@react-pdf/renderer";
import { modernStyles } from "@/components/pdf/styles/modern-styles";
import { formatDateForDisplay, getSkillLevel } from "@/lib/pdf/helpers";

/**
 * Modern Info Row - Personal information row in sidebar
 */
interface ModernInfoRowProps {
  label: string;
  value?: string;
}

export const ModernInfoRow: React.FC<ModernInfoRowProps> = ({ label, value }) => {
  if (!value) return null;
  
  return (
    <View style={modernStyles.infoRow}>
      <Text style={modernStyles.infoLabel}>{label}:</Text>
      <Text style={modernStyles.infoValue}>{value}</Text>
    </View>
  );
};

/**
 * Modern Skill Item - Skill with visual level indicator
 */
interface ModernSkillItemProps {
  name: string;
  level: string;
}

export const ModernSkillItem: React.FC<ModernSkillItemProps> = ({ name, level }) => {
  const levelCount = getSkillLevel(level);
  
  return (
    <View style={modernStyles.skillItemModern}>
      <Text style={modernStyles.skillName}>{name}</Text>
      <View style={modernStyles.skillLevelContainer}>
        <View style={modernStyles.skillLevelBar}>
          {[...Array(5)].map((_, index) => (
            <View 
              key={index} 
              style={index < levelCount ? modernStyles.skillLevelDot : modernStyles.skillLevelDotEmpty} 
            />
          ))}
        </View>
        <Text style={modernStyles.skillLevelText}>{level}</Text>
      </View>
    </View>
  );
};

/**
 * Modern Education Item - Education in sidebar
 */
interface ModernEducationItemProps {
  school: string;
  degree: string;
  field: string;
  startDate: Date | string;
  endDate?: Date | string;
  description?: string;
}

export const ModernEducationItem: React.FC<ModernEducationItemProps> = ({
  school,
  degree,
  field,
  startDate,
  endDate,
  description,
}) => {
  return (
    <View style={modernStyles.educationItemModern}>
      <Text style={modernStyles.educationSchoolModern}>{school}</Text>
      <Text style={modernStyles.educationDegreeModern}>
        {degree} - {field}
      </Text>
      <Text style={modernStyles.educationDateModern}>
        {formatDateForDisplay(startDate)} - {formatDateForDisplay(endDate)}
      </Text>
      {description && (
        <Text style={modernStyles.educationDescriptionModern}>{description}</Text>
      )}
    </View>
  );
};

/**
 * Modern Section Title - Section title with background
 */
interface ModernSectionTitleProps {
  title: string;
  variant?: "sidebar" | "content";
}

export const ModernSectionTitle: React.FC<ModernSectionTitleProps> = ({ 
  title, 
  variant = "sidebar" 
}) => {
  return (
    <Text style={variant === "sidebar" ? modernStyles.sidebarSectionTitle : modernStyles.contentSectionTitle}>
      {title}
    </Text>
  );
};

/**
 * Modern Experience Item - Work experience
 */
interface ModernExperienceItemProps {
  company: string;
  position: string;
  startDate: Date | string;
  endDate?: Date | string;
  description?: string;
}

export const ModernExperienceItem: React.FC<ModernExperienceItemProps> = ({
  company,
  position,
  startDate,
  endDate,
  description,
}) => {
  return (
    <View style={modernStyles.experienceItemModern}>
      <View style={modernStyles.experienceHeaderModern}>
        <View style={{ flex: 1 }}>
          <Text style={modernStyles.experienceCompanyModern}>{company}</Text>
          <Text style={modernStyles.experiencePositionModern}>{position}</Text>
        </View>
        <Text style={modernStyles.experienceDateModern}>
          {formatDateForDisplay(startDate)} - {formatDateForDisplay(endDate)}
        </Text>
      </View>
      {description && (
        <Text style={modernStyles.experienceDescriptionModern}>{description}</Text>
      )}
    </View>
  );
};

/**
 * Modern Project Item - Projects
 */
interface ModernProjectItemProps {
  name: string;
  position: string;
  description: string;
  link?: string;
}

export const ModernProjectItem: React.FC<ModernProjectItemProps> = ({
  name,
  position,
  description,
  link,
}) => {
  return (
    <View style={modernStyles.projectItemModern}>
      <Text style={modernStyles.projectNameModern}>{name}</Text>
      <Text style={modernStyles.projectPositionModern}>Vị trí: {position}</Text>
      <Text style={modernStyles.projectDescriptionModern}>{description}</Text>
      {link && <Text style={modernStyles.projectLinkModern}>Link: {link}</Text>}
    </View>
  );
};
