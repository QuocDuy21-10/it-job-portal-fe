"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Mail, Phone, User as UserIcon, Briefcase, Calendar, MapPin } from "lucide-react";
import CVFormSection from "@/components/sections/cv-form-section";
import PersonalInfoModal from "../modals/personal-info-modal";
import { PersonalInfo } from "@/features/cv-profile/schemas/cv-profile.schema";
import { useI18n } from "@/hooks/use-i18n";
import { formatLocaleDate } from "@/lib/utils/locale-formatters";

interface PersonalInfoSectionProps {
  personalInfo: {
    avatar?: string;
    title?: string;
    fullName: string;
    email: string;
    phone: string;
    address?: string;
    birthday?: Date;
    gender?: "male" | "female" | "other";
    personalLink?: string;
    bio?: string;
  };
  onUpdate: (field: string, value: string | Date) => void;
  onAvatarChange?: (file: File) => void; // New prop for handling avatar file
}

export default function PersonalInfoSection({
  personalInfo,
  onUpdate,
  onAvatarChange,
}: PersonalInfoSectionProps) {
  const { t, language } = useI18n();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (data: PersonalInfo, avatarFile?: File) => {
    // Update all fields
    if (data.avatar) onUpdate("avatar", data.avatar || "");
    if (data.title) onUpdate("title", data.title || "");
    onUpdate("fullName", data.fullName);
    onUpdate("email", data.email);
    onUpdate("phone", data.phone);
    if (data.birthday) onUpdate("birthday", data.birthday);
    if (data.gender) onUpdate("gender", data.gender);
    if (data.address) onUpdate("address", data.address || "");
    if (data.personalLink) onUpdate("personalLink", data.personalLink || "");
    if (data.bio) onUpdate("bio", data.bio || "");
    
    // Handle avatar file separately
    if (avatarFile && onAvatarChange) {
      onAvatarChange(avatarFile);
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return null;
    return formatLocaleDate(date, language);
  };

  const getGenderLabel = (gender?: string) => {
    switch (gender) {
      case "male":
        return t("cv.personalInfo.male");
      case "female":
        return t("cv.personalInfo.female");
      case "other":
        return t("cv.personalInfo.other");
      default:
        return null;
    }
  };
  return (
    <>
      <CVFormSection
        title={t("cv.personalInfo.title")}
        description={t("cv.personalInfo.description")}
        actionButton={
          <Button
            onClick={() => setIsModalOpen(true)}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            <Edit2 className="w-4 h-4" />
            {t("cv.personalInfo.editButton")}
          </Button>
        }
      >
        <Card className="p-6 bg-gradient-to-br from-card via-card to-secondary/20 border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Column: Avatar & Primary Details */}
            <div className="md:col-span-4 flex flex-col items-center text-center p-4 border-b md:border-b-0 md:border-r border-border/50 gap-4">
              {/* Avatar */}
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-primary/20 shadow-md group transition-transform duration-300 hover:scale-105">
                <Image
                  src={personalInfo.avatar || "/images/avatar-default.jpg"}
                  alt={personalInfo.fullName || "Avatar"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 112px, 112px"
                  priority
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground leading-tight">
                  {personalInfo.fullName || <span className="text-muted-foreground italic">{t("cv.personalInfo.noData")}</span>}
                </h3>
                {personalInfo.title ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                    <Briefcase className="w-3.5 h-3.5" />
                    {personalInfo.title}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground italic">{t("cv.personalInfo.noData")}</span>
                )}
              </div>
            </div>

            {/* Right Column: Other Details */}
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 pl-0 md:pl-4 self-center">
              {/* Email */}
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-1.5">
                  <Mail className="w-4 h-4 text-primary" />
                  {t("cv.personalInfo.email")}
                </div>
                <p className="text-sm text-foreground break-all font-medium">
                  {personalInfo.email || <span className="text-muted-foreground italic">{t("cv.personalInfo.noData")}</span>}
                </p>
              </div>

              {/* Phone */}
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-1.5">
                  <Phone className="w-4 h-4 text-primary" />
                  {t("cv.personalInfo.phone")}
                </div>
                <p className="text-sm text-foreground font-medium">
                  {personalInfo.phone || <span className="text-muted-foreground italic">{t("cv.personalInfo.noData")}</span>}
                </p>
              </div>

              {/* Birthday */}
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-1.5">
                  <Calendar className="w-4 h-4 text-primary" />
                  {t("cv.personalInfo.birthday")}
                </div>
                <p className="text-sm text-foreground font-medium">
                  {formatDate(personalInfo.birthday) || <span className="text-muted-foreground italic">{t("cv.personalInfo.noData")}</span>}
                </p>
              </div>

              {/* Gender */}
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-1.5">
                  <UserIcon className="w-4 h-4 text-primary" />
                  {t("cv.personalInfo.gender")}
                </div>
                <p className="text-sm text-foreground font-medium">
                  {getGenderLabel(personalInfo.gender) || <span className="text-muted-foreground italic">{t("cv.personalInfo.noData")}</span>}
                </p>
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-1.5">
                  <MapPin className="w-4 h-4 text-primary" />
                  {t("cv.personalInfo.address")}
                </div>
                <p className="text-sm text-foreground font-medium">
                  {personalInfo.address || <span className="text-muted-foreground italic">{t("cv.personalInfo.noData")}</span>}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </CVFormSection>

      <PersonalInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={personalInfo as PersonalInfo}
      />
    </>
  );
}
