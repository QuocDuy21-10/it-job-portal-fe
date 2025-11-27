"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, File, Trash2, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { SectionCard } from "../shared/section-card";
import { toast } from "sonner";

export default function MyCVPage() {
  const [uploadedCV, setUploadedCV] = useState<{
    name: string;
    size: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndUploadFile(file);
    }
  };

  const validateAndUploadFile = (file: File) => {
    // Validate file type and size
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      toast.error("Chỉ hỗ trợ các định dạng: .pdf, .doc, .docx");
      return;
    }

    if (file.size > maxSize) {
      toast.error("Kích thước tệp không vượt quá 5MB");
      return;
    }

    setUploadedCV({
      name: file.name,
      size: file.size,
    });
    toast.success("Tải lên CV thành công!");
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndUploadFile(file);
    }
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith(".pdf")) return "📄";
    if (fileName.endsWith(".doc") || fileName.endsWith(".docx")) return "📝";
    return "📎";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">My CV</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Quản lý CV của bạn để ứng tuyển vào các vị trí
        </p>
      </div>

      <SectionCard title="Tải lên CV" icon={FileText}>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragging
              ? "border-primary bg-primary/5 scale-[1.02]"
              : "border-border hover:border-primary/50 hover:bg-secondary/30"
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className={`w-12 h-12 mx-auto mb-4 transition-colors ${
            isDragging ? "text-primary" : "text-muted-foreground"
          }`} />
          <p className="text-foreground font-medium mb-2">
            {isDragging ? "Thả tệp vào đây" : "Kéo thả hoặc nhấp để tải lên CV"}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Hỗ trợ: .pdf, .doc, .docx (Tối đa 5MB)
          </p>
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="bg-primary hover:bg-primary/90 shadow-md"
          >
            <Upload className="w-4 h-4 mr-2" />
            Chọn tệp
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* File Guidelines */}
        <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-foreground mb-2">
                Lưu ý khi tải CV
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• CV nên được cập nhật thông tin mới nhất</li>
                <li>• Sử dụng định dạng PDF để đảm bảo hiển thị tốt nhất</li>
                <li>• Đặt tên file rõ ràng (VD: CV_HoTen_ViTri.pdf)</li>
                <li>• Kiểm tra kỹ thông tin trước khi tải lên</li>
              </ul>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Uploaded CV List */}
      {uploadedCV && (
        <SectionCard 
          title="CV đã tải lên" 
          icon={CheckCircle2}
          headerAction={
            <span className="text-sm text-muted-foreground">
              1 tệp
            </span>
          }
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/5 to-transparent border border-primary/20 rounded-lg hover:border-primary/40 transition-all group">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                  {getFileIcon(uploadedCV.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {uploadedCV.name}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(uploadedCV.size)}
                    </p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                      Đã tải lên
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-secondary"
                >
                  Xem
                </Button>
                <button
                  onClick={() => {
                    setUploadedCV(null);
                    toast.success("Đã xóa CV");
                  }}
                  className="p-2 hover:bg-destructive/10 rounded-md transition-colors"
                >
                  <Trash2 className="w-5 h-5 text-destructive" />
                </button>
              </div>
            </div>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
