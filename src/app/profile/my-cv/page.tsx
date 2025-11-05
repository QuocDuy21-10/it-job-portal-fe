"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, File, Trash2 } from "lucide-react";

export default function MyCVPage() {
  const [uploadedCV, setUploadedCV] = useState<{
    name: string;
    size: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        alert("Chỉ hỗ trợ các định dạng: .pdf, .doc, .docx");
        return;
      }

      if (file.size > maxSize) {
        alert("Kích thước tệp không vượt quá 5MB");
        return;
      }

      setUploadedCV({
        name: file.name,
        size: file.size,
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-foreground mb-6">My CV</h1>

      <Card className="p-8 bg-card border border-border">
        <div
          className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-secondary/50 transition"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-foreground font-medium mb-1">Tải lên CV của bạn</p>
          <p className="text-sm text-muted-foreground mb-4">
            Hỗ trợ: .pdf, .doc, .docx (Tối đa 5MB)
          </p>
          <Button className="bg-primary hover:bg-primary/90">Chọn tệp</Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Uploaded CV List */}
        {uploadedCV && (
          <div className="mt-6 space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              Tệp đã tải lên
            </h2>
            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
              <div className="flex items-center gap-3">
                <File className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">
                    {uploadedCV.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadedCV.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={() => setUploadedCV(null)}
                className="p-2 hover:bg-secondary rounded-md transition"
              >
                <Trash2 className="w-5 h-5 text-destructive" />
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
