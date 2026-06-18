import { useState } from "react";
import { toast } from "sonner";
import { useDeleteFileMutation, useUploadFileMutation } from "@/features/file/redux/file.api";
import { useI18n } from "@/hooks/use-i18n";

export function useFileOperations() {
  const { t } = useI18n();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
  const [deleteFile] = useDeleteFileMutation();

  const handleUpload = async (file: File, folderType: string) => {
    try {
      const response = await uploadFile({ file, folderType }).unwrap();
      if (!response.data?.fileName) {
        throw new Error(response.message || "Upload response missing file name");
      }

      toast.success(t("fileUpload.toasts.success"));
      return response.data.fileName;
    } catch (error: any) {
      console.error("Upload file error:", error);
      const errorMessage =
        error?.data?.message || t("fileUpload.toasts.error");
      toast.error(errorMessage);
      return null;
    }
  };

  const handleDelete = (fileName: string, folderType: string): void => {
    if (!fileName) return;
    deleteFile({ fileName, folderType }).catch((error) => {
      console.error("Delete file error:", error);
    });
  };

  return {
    isUploading,
    isMutating: isUploading,
    handleUpload,
    handleDelete,
  };
}
