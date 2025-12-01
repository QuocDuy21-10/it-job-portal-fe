"use client";

import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { X, Upload, FileText } from "lucide-react";
import { toast } from "sonner";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useCreateResumeWithUploadMutation } from "@/features/resume/redux/resume.api";
import { selectAuth } from "@/features/auth/redux/auth.slice";

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
  const [createResumeWithUpload, { isLoading: isUploading }] = useCreateResumeWithUploadMutation();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: "",
    email: user?.email || "",
  });
  const [cvFile, setCVFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        alert("Only .doc, .docx, and .pdf files are allowed");
        return;
      }

      if (file.size > maxSize) {
        alert("File size must not exceed 5MB");
        return;
      }

      setCVFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile) {
      toast.error("Vui lòng chọn file CV");
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
        toast.success("Nộp đơn ứng tuyển thành công!");
        setFormData({
          name: user?.name || "",
          phone: "",
          email: user?.email || "",
        });
        setCVFile(null);
        onClose();
      } else {
        throw new Error(response.message || "Có lỗi khi nộp đơn");
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || "Có lỗi xảy ra, vui lòng thử lại";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-card">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Ứng tuyển ngay</h2>
            <p className="text-sm text-muted-foreground mt-1">{jobTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Họ và Tên  <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Nhập họ và tên"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Số điện thoại  <span className="text-destructive">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              placeholder="Nhập số điện thoại"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">Email <span className="text-destructive">*</span></label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Nhập email"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* CV Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Tải lên CV <span className="text-destructive">*</span>
            </label>
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
              className="w-full px-4 py-3 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-secondary transition text-foreground"
            >
              {cvFile ? (
                <div className="flex items-center justify-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium text-sm">{cvFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(cvFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Upload className="w-5 h-5" />
                  <span>
                    Chọn tệp hoặc kéo thả (.doc, .docx, .pdf - Max 5MB)
                  </span>
                </div>
              )}
            </button>
            {!cvFile && (
              <p className="text-xs text-destructive mt-1">
                Vui lòng chọn tệp CV
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || isUploading || !cvFile}
            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-semibold h-10"
          >
            {isSubmitting || isUploading ? "Đang gửi..." : "Gửi đơn ứng tuyển"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
