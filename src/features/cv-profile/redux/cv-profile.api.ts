import { baseApi } from "@/lib/redux/api";
import { ApiResponse } from "@/shared/base/api-response.base";
import { 
  CVProfile, 
  UpsertCVProfileRequest 
} from "../schemas/cv-profile.schema";

export const cvProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Upsert CV Profile (Create or Update) with Avatar Upload
    upsertCVProfile: builder.mutation<ApiResponse<CVProfile>, { data: UpsertCVProfileRequest; avatar?: File }>({
      query: ({ data, avatar }) => {
        const formData = new FormData();
        
        // Add avatar file if provided
        if (avatar) {
          formData.append("avatar", avatar);
        }
        
        // Add CV profile data as a single JSON string
        formData.append("cvData", JSON.stringify(data));
        
        return {
          url: "/cv-profiles/upsert",
          method: "POST",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
      },
      invalidatesTags: ["CVProfile"],
    }),

    // Get Current User's CV Profile
    getMyCVProfile: builder.query<ApiResponse<CVProfile>, void>({
      query: () => ({
        url: "/cv-profiles/me",
        method: "GET",
      }),
      providesTags: ["CVProfile"],
    }),
  }),
});

export const {
  useUpsertCVProfileMutation,
  useGetMyCVProfileQuery,
} = cvProfileApi;
