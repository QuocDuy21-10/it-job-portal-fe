"use client";

import { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Upload, Trash2, Camera, AlertCircle } from "lucide-react";
import { PersonalInfoSchema, PersonalInfo } from "@/features/cv-profile/schemas/cv-profile.schema";
import { useI18n } from "@/hooks/use-i18n";


interface PersonalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PersonalInfo) => void;
  initialData?: PersonalInfo;
}

export default function PersonalInfoModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: PersonalInfoModalProps) {
  const { t } = useI18n();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PersonalInfo>({
    resolver: zodResolver(PersonalInfoSchema),
    defaultValues: initialData || {
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
    }
  }, [isOpen, initialData, reset]);

  const handleFormSubmit = async (data: PersonalInfo) => {
    onSubmit(data);
    onClose();
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-card via-card to-secondary/20 border-border/50 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {t("cv.personalInfo.title")}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t("cv.personalInfo.description")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 mt-4">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-xl border border-border/50">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-secondary border-4 border-primary/20 shadow-lg">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                    <Camera className="w-12 h-12 text-muted-foreground/50" />
                  </div>
                )}
              </div>
              {avatarPreview && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="absolute -top-2 -right-2 p-2 bg-destructive hover:bg-destructive/90 rounded-full shadow-lg transition-all hover:scale-110"
                >
                  <Trash2 className="w-4 h-4 text-destructive-foreground" />
                </button>
              )}
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
              className="hover:bg-primary/10 hover:border-primary/30"
            >
              <Upload className="w-4 h-4 mr-2" />
              {t("cv.personalInfo.uploadAvatar")}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              {t("cv.personalInfo.avatarFormat")}
            </p>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-1 mb-2">
                    {t("cv.personalInfo.fullName")}
                    <span className="text-destructive">*</span>
                  </label>
                  <input
                    {...field}
                    type="text"
                    placeholder={t("cv.personalInfo.fullNamePlaceholder")}
                    className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all ${
                      errors.fullName ? "border-destructive" : "border-border"
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-destructive flex items-center gap-1 mt-1.5">
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
                  <label className="text-sm font-semibold text-foreground flex items-center gap-1 mb-2">
                    {t("cv.personalInfo.email")}
                    <span className="text-destructive">*</span>
                  </label>
                  <input
                    {...field}
                    type="email"
                    placeholder={t("cv.personalInfo.emailPlaceholder")}
                    className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all ${
                      errors.email ? "border-destructive" : "border-border"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive flex items-center gap-1 mt-1.5">
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
                  <label className="text-sm font-semibold text-foreground flex items-center gap-1 mb-2">
                    {t("cv.personalInfo.phone")}
                    <span className="text-destructive">*</span>
                  </label>
                  <input
                    {...field}
                    type="tel"
                    placeholder={t("cv.personalInfo.phonePlaceholder")}
                    className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all ${
                      errors.phone ? "border-destructive" : "border-border"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive flex items-center gap-1 mt-1.5">
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
                  <label className="text-sm font-semibold text-foreground mb-2 block">
                    {t("cv.personalInfo.birthday")}
                  </label>
                  <input
                    type="date"
                    value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                    onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
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
                  <label className="text-sm font-semibold text-foreground mb-2 block">
                    {t("cv.personalInfo.gender")}
                  </label>
                  <select
                    {...field}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
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
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-foreground mb-2 block">
                    {t("cv.personalInfo.address")}
                  </label>
                  <input
                    {...field}
                    type="text"
                    placeholder={t("cv.personalInfo.addressPlaceholder")}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>
              )}
            />

            {/* Personal Link */}
            <Controller
              name="personalLink"
              control={control}
              render={({ field }) => (
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-foreground mb-2 block">
                    {t("cv.personalInfo.personalLink")}
                  </label>
                  <input
                    {...field}
                    type="url"
                    placeholder={t("cv.personalInfo.personalLinkPlaceholder")}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>
              )}
            />

            {/* Bio */}
            <Controller
              name="bio"
              control={control}
              render={({ field }) => (
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-foreground mb-2 block">
                    {t("cv.personalInfo.bio")}
                  </label>
                  <textarea
                    {...field}
                    rows={4}
                    placeholder={t("cv.personalInfo.bioPlaceholder")}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                  />
                </div>
              )}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
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
