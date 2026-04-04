import { useState } from "react";
import { toast } from "sonner";
import { useDeleteFileMutation, useUploadFileMutation } from "@/features/file/redux/file.api";

export function useFileOperations() {
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
  const [deleteFile] = useDeleteFileMutation();

  const handleUpload = async (file: File, folderType: string) => {
    try {
      const response = await uploadFile({ file, folderType }).unwrap();
      toast.success("Upload file thành công!");
      return response.data.fileName;
    } catch (error: any) {
      console.error("Upload file error:", error);
      const errorMessage =
        error?.data?.message || "Upload file thất bại. Vui lòng thử lại.";
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
