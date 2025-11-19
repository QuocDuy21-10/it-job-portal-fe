import { useState, useCallback } from "react";
import { cvService } from "@/features/cv/cv.service";
import { IUpsertCVProfileRequest, ICVProfile } from "@/shared/types/cv";

interface UseCV {
  isLoading: boolean;
  error: string | null;
  cvData: ICVProfile | null;
  upsertCV: (data: IUpsertCVProfileRequest) => Promise<ICVProfile | null>;
  fetchMyCVProfile: () => Promise<ICVProfile | null>;
  clearError: () => void;
}

/**
 * Custom Hook for CV Management
 * Quản lý state và logic cho CV operations
 */
export const useCV = (): UseCV => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cvData, setCvData] = useState<ICVProfile | null>(null);

  /**
   * Fetch current user's CV Profile
   * GET /cv-profiles/me
   */
  const fetchMyCVProfile = useCallback(async (): Promise<ICVProfile | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await cvService.getMyCVProfile();
      
      // API returns nested structure: { statusCode, message, data: { statusCode, message, data: ICVProfile } }
      if (response.data?.data?.data) {
        const cvProfile = response.data.data.data;
        setCvData(cvProfile);
        return cvProfile;
      } else if (response.data?.data) {
        // Alternative response structure
        const cvProfile = response.data.data;
        setCvData(cvProfile);
        return cvProfile;
      } else {
        return null; // No CV profile yet
      }
    } catch (err: any) {
      // 404 means user hasn't created CV yet - this is normal
      if (err?.response?.status === 404) {
        setCvData(null);
        return null;
      }
      
      const errorMessage = err?.response?.data?.message || err.message || "Có lỗi xảy ra khi tải CV";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Upsert CV Profile (Create or Update)
   * POST /cv-profiles/upsert
   */
  const upsertCV = useCallback(async (data: IUpsertCVProfileRequest): Promise<ICVProfile | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await cvService.upsertCVProfile(data);
      
      if (response.statusCode === 200 && response.data?.data) {
        const cvProfile = response.data.data;
        setCvData(cvProfile);
        return cvProfile;
      } else {
        throw new Error(response.data?.message || "Failed to save CV");
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err.message || "Có lỗi xảy ra khi lưu CV";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    cvData,
    upsertCV,
    fetchMyCVProfile,
    clearError,
  };
};
