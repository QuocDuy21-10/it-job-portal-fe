"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Upload, AlertCircle } from "lucide-react";
import { PersonalInfoSchema, PersonalInfo } from "@/features/cv-profile/schemas/cv-profile.schema";
import { useI18n } from "@/hooks/use-i18n";


interface PersonalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PersonalInfo, avatarFile?: File) => void;
  initialData?: PersonalInfo;
  isEmailReadOnly?: boolean;
}

export default function PersonalInfoModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEmailReadOnly,
}: PersonalInfoModalProps) {
  const { t } = useI18n();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<PersonalInfo>({
    resolver: zodResolver(PersonalInfoSchema),
    defaultValues: initialData || {
      avatar: "",
      title: "",
      fullName: "",
      email: "",
      phone: "",
      birthday: undefined,
      gender: "male",
      address: "",
      personalLink: "",
      bio: "",
    },
  });

  useEffect(() => {
    if (isOpen && initialData) {
      reset(initialData);
      setAvatarPreview(initialData.avatar || null);
      setAvatarFile(null); // Reset file when opening with initial data
    }
  }, [isOpen, initialData, reset]);

  const handleFormSubmit = async (data: PersonalInfo) => {
    const submitData = {
      ...data,
      avatar: avatarPreview || "", // Keep existing avatar URL if no new file
    };
    onSubmit(submitData, avatarFile || undefined);
    onClose();
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        alert("Chỉ chấp nhận file ảnh định dạng JPEG, PNG, GIF, WEBP");
        return;
      }
      
      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        alert("Kích thước file không được vượt quá 5MB");
        return;
      }
      
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const hasAvatar = Boolean(avatarPreview || initialData?.avatar);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:max-w-[800px] w-[95vw] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-card via-card to-secondary/20 border-border/50 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {t("cv.personalInfo.title")}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t("cv.personalInfo.description")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left Column: Avatar Section */}
            <div className="md:col-span-4 flex flex-col items-center gap-4 p-5 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-xl border border-border/50">
              <div className="relative group">
                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-secondary border-4 border-primary/20 shadow-lg">
                  <Image
                    src={avatarPreview || "/images/avatar-default.jpg"}
                    alt="Avatar preview"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 128px, 128px"
                    priority
                  />
                </div>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="w-full hover:bg-primary/10 hover:border-primary/30"
              >
                <Upload className="w-4 h-4 mr-2" />
                {hasAvatar ? t("cv.personalInfo.updateAvatar") : t("cv.personalInfo.uploadAvatar")}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                {t("cv.personalInfo.avatarFormat")}
              </p>
            </div>

            {/* Right Column: Form Fields */}
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Title */}
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <div className="sm:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-medium mb-1.5 text-foreground">
                      {t("cv.personalInfo.titleLabel")}
                    </label>
                    <input
                      {...field}
                      value={field.value || ""}
                      type="text"
                      placeholder={t("cv.personalInfo.titlePlaceholder")}
                      className={`w-full px-3 py-2 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm ${
                        errors.title ? "border-destructive" : "border-border"
                      }`}
                    />
                    {errors.title && (
                      <p className="mt-1 text-xs text-destructive flex items-center gap-1">
                        <span className="font-medium">⚠</span> {errors.title.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* Full Name */}
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <div className="sm:col-span-2">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-1 mb-1.5">
                      {t("cv.personalInfo.fullName")}
                      <span className="text-destructive">*</span>
                    </label>
                    <input
                      {...field}
                      type="text"
                      placeholder={t("cv.personalInfo.fullNamePlaceholder")}
                      className={`w-full px-3 py-2 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm ${
                        errors.fullName ? "border-destructive" : "border-border"
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* Email */}
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="text-sm font-semibold text-foreground flex items-center gap-1 mb-1.5">
                      {t("cv.personalInfo.email")}
                      <span className="text-destructive">*</span>
                    
                    </label>
                    <input
                      {...field}
                      type="email"
                      placeholder={t("cv.personalInfo.emailPlaceholder")}
                      readOnly={isEmailReadOnly}
                      disabled={isEmailReadOnly}
                      className={`w-full px-3 py-2 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm ${
                        isEmailReadOnly
                          ? "bg-muted/50 cursor-not-allowed opacity-70 focus:ring-0 focus:border-border"
                          : ""
                      } ${
                        errors.email ? "border-destructive" : "border-border"
                      }`}
                    />
                    
                    {errors.email && (
                      <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* Phone */}
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="text-sm font-semibold text-foreground flex items-center gap-1 mb-1.5">
                      {t("cv.personalInfo.phone")}
                      <span className="text-destructive">*</span>
                    </label>
                    <input
                      {...field}
                      type="tel"
                      placeholder={t("cv.personalInfo.phonePlaceholder")}
                      className={`w-full px-3 py-2 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm ${
                        errors.phone ? "border-destructive" : "border-border"
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* Birthday */}
              <Controller
                name="birthday"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1.5 block">
                      {t("cv.personalInfo.birthday")}
                    </label>
                    <input
                      type="date"
                      value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                      onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                    />
                  </div>
                )}
              />

              {/* Gender */}
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1.5 block">
                      {t("cv.personalInfo.gender")}
                    </label>
                    <select
                      {...field}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                    >
                      <option value="male">{t("cv.personalInfo.male")}</option>
                      <option value="female">{t("cv.personalInfo.female")}</option>
                      <option value="other">{t("cv.personalInfo.other")}</option>
                    </select>
                  </div>
                )}
              />

              {/* Address */}
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1.5 block">
                      {t("cv.personalInfo.address")}
                    </label>
                    <input
                      {...field}
                      type="text"
                      placeholder={t("cv.personalInfo.addressPlaceholder")}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                    />
                  </div>
                )}
              />

              {/* Personal Link */}
              <Controller
                name="personalLink"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1.5 block">
                      {t("cv.personalInfo.personalLink")}
                    </label>
                    <input
                      {...field}
                      type="url"
                      placeholder={t("cv.personalInfo.personalLinkPlaceholder")}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                    />
                  </div>
                )}
              />

              {/* Bio */}
              <Controller
                name="bio"
                control={control}
                render={({ field }) => (
                  <div className="sm:col-span-2">
                    <label className="text-sm font-semibold text-foreground mb-1.5 block">
                      {t("cv.personalInfo.bio")}
                    </label>
                    <textarea
                      {...field}
                      rows={2}
                      placeholder={t("cv.personalInfo.bioPlaceholder")}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm resize-none"
                    />
                  </div>
                )}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-border hover:bg-secondary/80 transition-all"
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 mr-2" />
              {t("cv.personalInfo.cancelButton")}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
            >
              {isSubmitting ? "..." : t("cv.personalInfo.saveButton")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
