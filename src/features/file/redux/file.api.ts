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

        return {
          url: "/files/upload",
          method: "POST",
          body: formData,
          headers: {
            folder_type: folderType,
          },
          formData: true,
        };
      },
      // Invalidate the files list after upload
      // invalidatesTags: ["Files"],
    }),
  }),
});

export const { useUploadFileMutation } = fileApi;
