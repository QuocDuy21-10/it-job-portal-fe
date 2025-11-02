import { useState } from "react";
import { toast } from "sonner";
import { useUploadFileMutation } from "@/features/file/redux/file.api";

export function useFileOperations() {
  // Add upload mutation
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

  // Add upload handler
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

  return {
    isUploading,
    isMutating: isUploading,
    handleUpload,
  };
}
