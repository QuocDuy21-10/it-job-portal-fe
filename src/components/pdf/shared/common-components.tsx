/**
 * Shared PDF Components
 * Reusable components used across different CV templates
 */

import React from "react";
import { Text, View, Image } from "@react-pdf/renderer";
import { ICVProfile } from "@/shared/types/cv";
import { classicStyles } from "@/components/pdf/styles/classic-styles";
import {
  EmailIcon,
  PhoneIcon,
  LocationIcon,
  CalendarIcon,
  UserIcon,
  LinkIcon,
} from "@/components/pdf/icons";
import { CVColors } from "@/lib/pdf/cv-styles";
import { formatDateForDisplay, formatGender } from "@/lib/pdf/helpers";

/**
 * Contact Row Component
 * Displays a single contact information row with icon, label, and value
 */
interface ContactRowProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  placeholder?: string;
}

export const ContactRowItem: React.FC<ContactRowProps> = ({ 
  icon, 
  label, 
  value, 
  placeholder 
}) => (
  <View style={classicStyles.contactRow}>
    {icon}
    <Text style={classicStyles.contactLabel}>{label}:</Text>
    {value ? (
      <Text style={classicStyles.contactValue}>{value}</Text>
    ) : (
      <Text style={classicStyles.contactPlaceholder}>{placeholder || "Chưa cập nhật"}</Text>
    )}
  </View>
);

/**
 * Section Component
 * Wrapper for CV sections with consistent title styling
 */
interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ title, children }) => (
  <View style={classicStyles.section}>
    <Text style={classicStyles.sectionTitle}>{title}</Text>
    <View style={classicStyles.sectionContent}>
      {children}
    </View>
  </View>
);

/**
 * CV Header Component
 * Header with avatar and personal information
 * Used in Classic template
 */
interface CVHeaderProps {
  personalInfo: ICVProfile['personalInfo'];
}

export const CVHeader: React.FC<CVHeaderProps> = ({ personalInfo }) => {
  const {
    avatar,
    fullName,
    title,
    birthday,
    gender,
    phone,
    email,
    personalLink,
    address,
  } = personalInfo;

  return (
    <View style={classicStyles.header}>
      {/* Avatar Section */}
      <View style={classicStyles.avatarContainer}>
        {avatar ? (
          <Image src={avatar} style={classicStyles.avatar} />
        ) : (
          <View style={classicStyles.avatarPlaceholder}>
            <Text style={classicStyles.avatarPlaceholderText}>Ảnh</Text>
          </View>
        )}
      </View>

      {/* Personal Info Section */}
      <View style={classicStyles.headerInfo}>
        <Text style={classicStyles.name}>{fullName || "Họ và tên"}</Text>
        {title && <Text style={classicStyles.title}>{title}</Text>}
        
        <View style={classicStyles.contactGrid}>
          <ContactRowItem
            icon={<CalendarIcon size={8} color={CVColors.textMuted} />}
            label="Ngày sinh"
            value={birthday ? formatDateForDisplay(birthday) : undefined}
            placeholder="DD/MM/YYYY"
          />
          <ContactRowItem
            icon={<UserIcon size={8} color={CVColors.textMuted} />}
            label="Giới tính"
            value={formatGender(gender)}
          />
          <ContactRowItem
            icon={<PhoneIcon size={8} color={CVColors.textMuted} />}
            label="Điện thoại"
            value={phone}
            placeholder="Số điện thoại của bạn"
          />
          <ContactRowItem
            icon={<EmailIcon size={8} color={CVColors.textMuted} />}
            label="Email"
            value={email}
            placeholder="email@example.com"
          />
          <ContactRowItem
            icon={<LinkIcon size={8} color={CVColors.textMuted} />}
            label="Website"
            value={personalLink}
            placeholder="website.com"
          />
          <ContactRowItem
            icon={<LocationIcon size={8} color={CVColors.textMuted} />}
            label="Địa chỉ"
            value={address}
            placeholder="Địa chỉ của bạn"
          />
        </View>
      </View>
    </View>
  );
};
