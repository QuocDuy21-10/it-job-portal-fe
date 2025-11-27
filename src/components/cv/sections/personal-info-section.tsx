"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Edit2, Mail, Phone, MapPin, Calendar, User as UserIcon, Link as LinkIcon, Briefcase } from "lucide-react";
import CVFormSection from "@/components/sections/cv-form-section";
import PersonalInfoModal from "../modals/personal-info-modal";
import { PersonalInfo } from "@/features/cv-profile/schemas/cv-profile.schema";
import { useI18n } from "@/hooks/use-i18n";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PersonalInfoSectionProps {
  personalInfo: {
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
}

export default function PersonalInfoSection({
  personalInfo,
  onUpdate,
}: PersonalInfoSectionProps) {
  const { t } = useI18n();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (data: PersonalInfo) => {
    // Update all fields
    onUpdate("fullName", data.fullName);
    onUpdate("email", data.email);
    onUpdate("phone", data.phone);
    if (data.birthday) onUpdate("birthday", data.birthday);
    if (data.gender) onUpdate("gender", data.gender);
    if (data.address) onUpdate("address", data.address || "");
    if (data.personalLink) onUpdate("personalLink", data.personalLink || "");
    if (data.bio) onUpdate("bio", data.bio || "");
  };

  const formatDate = (date?: Date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("vi-VN");
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
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium text-sm shadow-md hover:shadow-lg transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                  {t("cv.personalInfo.editButton")}
                </button>
        }
      >
        <Card className="p-6 bg-gradient-to-br from-card to-secondary/20 border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                <UserIcon className="w-4 h-4 text-primary" />
                {t("cv.personalInfo.fullName")}
              </div>
              <p className="text-base font-semibold text-foreground">
                {personalInfo.fullName || <span className="text-muted-foreground italic">{t("cv.personalInfo.noData")}</span>}
              </p>
            </div>

            {/* Email */}
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                <Mail className="w-4 h-4 text-primary" />
                {t("cv.personalInfo.email")}
              </div>
              <p className="text-base text-foreground break-all">
                {personalInfo.email || <span className="text-muted-foreground italic">{t("cv.personalInfo.noData")}</span>}
              </p>
            </div>

            {/* Phone */}
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                <Phone className="w-4 h-4 text-primary" />
                {t("cv.personalInfo.phone")}
              </div>
              <p className="text-base text-foreground">
                {personalInfo.phone || <span className="text-muted-foreground italic">{t("cv.personalInfo.noData")}</span>}
              </p>
            </div>

            {/* Birthday */}
            {personalInfo.birthday && (
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  {t("cv.personalInfo.birthday")}
                </div>
                <p className="text-base text-foreground">
                  {formatDate(personalInfo.birthday)}
                </p>
              </div>
            )}

            {/* Gender */}
            {personalInfo.gender && (
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                  <Briefcase className="w-4 h-4 text-primary" />
                  {t("cv.personalInfo.gender")}
                </div>
                <p className="text-base text-foreground">
                  {getGenderLabel(personalInfo.gender)}
                </p>
              </div>
            )}

            {/* Address */}
            {personalInfo.address && (
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  {t("cv.personalInfo.address")}
                </div>
                <p className="text-base text-foreground">
                  {personalInfo.address}
                </p>
              </div>
            )}

            {/* Personal Link */}
            {personalInfo.personalLink && (
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                  <LinkIcon className="w-4 h-4 text-primary" />
                  {t("cv.personalInfo.personalLink")}
                </div>
                <a
                  href={personalInfo.personalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-primary hover:text-primary/80 hover:underline break-all"
                >
                  {personalInfo.personalLink}
                </a>
              </div>
            )}

            {/* Bio */}
            {personalInfo.bio && (
              <div className="md:col-span-2">
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  {t("cv.personalInfo.bio")}
                </div>
                <p className="text-base text-foreground whitespace-pre-wrap">
                  {personalInfo.bio}
                </p>
              </div>
            )}
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
