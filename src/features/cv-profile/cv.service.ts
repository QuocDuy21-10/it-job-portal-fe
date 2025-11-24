import axiosInstance from "@/lib/axios/axios-instance";
import { IUpsertCVProfileRequest, IUpsertCVProfileResponse } from "@/shared/types/cv";

/**
 * CV Profile Service
 * Xử lý các API calls liên quan đến CV Profile
 */

export const cvService = {
  /**
   * Upsert CV Profile (Create or Update)
   * POST /cv-profiles/upsert
   */
  upsertCVProfile: async (data: IUpsertCVProfileRequest): Promise<IUpsertCVProfileResponse> => {
    try {
      const response = await axiosInstance.post<IUpsertCVProfileResponse>(
        "/cv-profiles/upsert",
        data
      );
      return response as unknown as IUpsertCVProfileResponse;
    } catch (error: any) {
      console.error("[CV Service] Upsert CV Profile failed:", error);
      throw error;
    }
  },

  /**
   * Get Current User's CV Profile
   * GET /cv-profiles/me
   */
  getMyCVProfile: async () => {
    try {
      const response = await axiosInstance.get("/cv-profiles/me");
      return response;
    } catch (error: any) {
      console.error("[CV Service] Get CV Profile failed:", error);
      throw error;
    }
  },
};
