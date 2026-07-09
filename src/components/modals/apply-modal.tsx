"use client";

import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Upload, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "../ui/drawer";
import { useCreateResumeWithUploadMutation } from "@/features/resume/redux/resume.api";
import { selectAuth } from "@/features/auth/redux/auth.slice";
import { useI18n } from "@/hooks/use-i18n";
import { useMediaQuery } from "@/hooks/use-media-query";

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  jobId: string;
  companyId: string;
}

export default function ApplyModal({
  isOpen,
  onClose,
  jobTitle,
  jobId,
  companyId,
}: ApplyModalProps) {
  const { user } = useSelector(selectAuth);
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [createResumeWithUpload, { isLoading: isUploading }] = useCreateResumeWithUploadMutation();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: "",
    email: user?.email || "",
  });
  const [cvFile, setCVFile] = useState<File | null>(null);
  const [showCVError, setShowCVError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setShowCVError(false);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = [
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/pdf",
      ];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        toast.error(t("applyModal.validation.invalidFileType"));
        return;
      }

      if (file.size > maxSize) {
        toast.error(t("applyModal.validation.fileTooLarge"));
        return;
      }

      setCVFile(file);
      setShowCVError(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile) {
      setShowCVError(true);
      toast.error(t("applyModal.validation.fileRequired"));
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload CV and create resume in one API call
      const response = await createResumeWithUpload({
        file: cvFile,
        jobId: jobId,
      }).unwrap();

      if (response.statusCode === 201) {
        toast.success(t("applyModal.toasts.submitSuccess"));
        setFormData({
          name: user?.name || "",
          phone: "",
          email: user?.email || "",
        });
        setCVFile(null);
        setShowCVError(false);
        onClose();
      } else {
        throw new Error(response.message || "Có lỗi khi nộp đơn");
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        t("applyModal.toasts.submitErrorFallback");
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="apply-name" className="text-sm font-medium text-foreground">
          {t("applyModal.fields.name.label")}{" "}
          <span className="text-destructive">*</span>
        </Label>
        <Input
          id="apply-name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          placeholder={t("applyModal.fields.name.placeholder")}
          className="rounded-xl h-11 transition-all"
        />
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="apply-phone" className="text-sm font-medium text-foreground">
          {t("applyModal.fields.phone.label")}{" "}
          <span className="text-destructive">*</span>
        </Label>
        <Input
          id="apply-phone"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          required
          placeholder={t("applyModal.fields.phone.placeholder")}
          className="rounded-xl h-11 transition-all"
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="apply-email" className="text-sm font-medium text-foreground">
          {t("applyModal.fields.email.label")}{" "}
          <span className="text-destructive">*</span>
        </Label>
        <Input
          id="apply-email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          placeholder={t("applyModal.fields.email.placeholder")}
          className="rounded-xl h-11 transition-all"
        />
      </div>

      {/* CV Upload */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">
          {t("applyModal.fields.cv.label")}{" "}
          <span className="text-destructive">*</span>
        </Label>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".doc,.docx,.pdf"
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full px-4 py-5 border-2 border-dashed border-border/80 hover:border-primary/50 hover:bg-muted/40 rounded-xl transition duration-200 text-foreground flex items-center justify-center min-h-[72px]"
        >
          {cvFile ? (
            <div className="flex items-center justify-center gap-3">
              <FileText className="w-6 h-6 text-primary shrink-0" />
              <div className="text-left min-w-0">
                <p className="font-semibold text-sm truncate max-w-[240px]">{cvFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(cvFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Upload className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                {t("applyModal.fields.cv.placeholder")}
              </span>
            </div>
          )}
        </button>
        {showCVError && !cvFile && (
          <p className="text-xs text-destructive mt-1">
            {t("applyModal.validation.fileRequired")}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting || isUploading}
        onClick={() => {
          if (!cvFile) {
            setShowCVError(true);
          }
        }}
        className="w-full h-11 font-semibold rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] mt-4"
      >
        {isSubmitting || isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("applyModal.actions.submitting")}
          </>
        ) : (
          t("applyModal.actions.submit")
        )}
      </Button>
    </form>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
        <DrawerContent className="max-h-[92vh] flex flex-col rounded-t-2xl border-t bg-background px-4 pb-6">
          <DrawerHeader className="text-left px-0 pb-2 pt-4">
            <DrawerTitle className="text-xl font-bold text-foreground">
              {t("applyModal.title")}
            </DrawerTitle>
            <DrawerDescription className="text-sm text-muted-foreground mt-1">
              {jobTitle}
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto pt-2 pb-4 scrollbar-none">
            {formContent}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md p-0 bg-background rounded-2xl border border-border/50 shadow-2xl overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <DialogTitle className="text-xl font-bold text-foreground">
            {t("applyModal.title")}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            {jobTitle}
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto p-6 pt-4 scrollbar-none">
          {formContent}
        </div>
      </DialogContent>
    </Dialog>
  );
}
