import { baseApi } from "@/lib/redux/api";
import { ApiResponse } from "@/shared/base/api-response.base";

export const fileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation<
      ApiResponse<{ fileName: string }>,
      { file: File; folderType: string }
    >({
      query: ({ file, folderType }) => {
        const formData = new FormData();
        formData.append("file", file);
        
        // DO NOT set Content-Type header - let axios auto-detect FormData
        // and set multipart/form-data with proper boundary
        return {
          url: "/files/upload",
          method: "POST",
          data: formData,
          headers: {
            folder_type: folderType,
            // Content-Type will be auto-set by axios for FormData
          },
        };
      },
    }),
  }),
});

export const { useUploadFileMutation } = fileApi;
