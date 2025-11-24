import { baseApi } from "@/lib/redux/api";
import { ApiResponse } from "@/shared/base/api-response.base";
import { 
  CVProfile, 
  UpsertCVProfileRequest 
} from "../schemas/cv-profile.schema";

export const cvProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Upsert CV Profile (Create or Update)
    upsertCVProfile: builder.mutation<ApiResponse<CVProfile>, UpsertCVProfileRequest>({
      query: (data) => ({
        url: "/cv-profiles/upsert",
        method: "POST",
        data: data,
      }),
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
