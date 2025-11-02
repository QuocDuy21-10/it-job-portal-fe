"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useFileOperations } from "@/hooks/use-file";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { API_BASE_URL_IMAGE } from "@/shared/constants/constant";

interface LogoUploadProps {
  value?: string;
  onChange: (fileName: string) => void;
  disabled?: boolean;
}

const ALLOWED_FORMATS = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export function LogoUpload({ value, onChange, disabled }: LogoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { handleUpload, isUploading } = useFileOperations();

  // Convert file to base64 for preview
  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Validate file before upload
  const validateFile = (file: File): boolean => {
    setError(null);

    if (!ALLOWED_FORMATS.includes(file.type)) {
      setError("Only JPG, PNG, GIF and WebP formats are supported");
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File size must not exceed 2MB");
      return false;
    }

    return true;
  };

  // Handle file selection and upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!validateFile(file)) {
      e.target.value = "";
      return;
    }

    try {
      // Generate preview
      const base64Preview = await getBase64(file);
      setPreview(base64Preview);

      // Upload file
      const fileName = await handleUpload(file, "company");
      if (fileName) {
        onChange(fileName);
      } else {
        setPreview(null);
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Error uploading logo");
      setPreview(null);
    } finally {
      e.target.value = "";
    }
  };

  // Handle logo removal
  const handleRemove = () => {
    onChange("");
    setPreview(null);
    setError(null);
  };

  // Get display URL for logo
  const getDisplayUrl = () => {
    if (preview) return preview;
    if (value) return `${API_BASE_URL_IMAGE}/images/company/${value}`;
    return null;
  };

  const displayUrl = getDisplayUrl();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        {displayUrl && (
          <Dialog>
            <DialogTrigger>
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-input bg-muted cursor-pointer hover:opacity-80 transition-opacity">
                <Image
                  src={displayUrl}
                  alt="Logo preview"
                  fill
                  className="object-cover"
                />
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <div className="relative h-96 w-full">
                <Image
                  src={displayUrl}
                  alt="Logo preview"
                  fill
                  className="object-contain"
                />
              </div>
            </DialogContent>
          </Dialog>
        )}

        <div className="flex-1">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-input px-4 py-3 hover:bg-muted">
            <Upload className="h-4 w-4" />
            <span className="text-sm text-muted-foreground">
              {isUploading ? "Uploading..." : "Choose logo file"}
            </span>
            <input
              type="file"
              accept={ALLOWED_FORMATS.join(",")}
              onChange={handleFileChange}
              disabled={disabled || isUploading}
              className="hidden"
            />
          </label>
          <p className="mt-1 text-xs text-muted-foreground">
            JPG, PNG, GIF, WebP • Max 2MB
          </p>
        </div>

        {displayUrl && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={disabled || isUploading}
            className="h-10 w-10 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
