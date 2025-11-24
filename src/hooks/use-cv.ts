import { useState, useCallback } from "react";
import { 
  useUpsertCVProfileMutation, 
  useGetMyCVProfileQuery 
} from "@/features/cv-profile/redux/cv-profile.api";
import { 
  UpsertCVProfileRequest, 
  CVProfile 
} from "@/features/cv-profile/schemas/cv-profile.schema";

interface UseCV {
  isLoading: boolean;
  error: string | null;
  cvData: CVProfile | null;
  upsertCV: (data: UpsertCVProfileRequest) => Promise<CVProfile | null>;
  fetchMyCVProfile: () => Promise<CVProfile | null>;
  clearError: () => void;
  refetch: () => void;
}

/**
 * Custom Hook for CV Management using RTK Query
 * Quản lý state và logic cho CV operations
 */
export const useCV = (): UseCV => {
  const [error, setError] = useState<string | null>(null);

  // RTK Query hooks
  const { 
    data: cvProfileData, 
    isLoading: isLoadingQuery,
    refetch 
  } = useGetMyCVProfileQuery();
  
  const [upsertCVMutation, { isLoading: isUpserting }] = useUpsertCVProfileMutation();

  const cvData = cvProfileData?.data?.data || null;
  const isLoading = isLoadingQuery || isUpserting;

  /**
   * Fetch current user's CV Profile
   * GET /cv-profiles/me
   * Returns 200 OK with data: null if user doesn't have CV Profile yet
   */
  const fetchMyCVProfile = useCallback(async (): Promise<CVProfile | null> => {
    setError(null);

    try {
      const result = await refetch();
      
      // Success: data exists (user has CV Profile)
      if (result.data?.data?.data) {
        return result.data.data.data;
      }
      
      // Success: data is null (user doesn't have CV Profile yet - this is normal)
      if (result.data?.data?.data === null) {
        return null;
      }
      
      // Error occurred
      if (result.error) {
        throw result.error;
      }
      
      return null;
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || "Có lỗi xảy ra khi tải CV";
      setError(errorMessage);
      return null;
    }
  }, [refetch]);

  /**
   * Upsert CV Profile (Create or Update)
   * POST /cv-profiles/upsert
   */
  const upsertCV = useCallback(async (data: UpsertCVProfileRequest): Promise<CVProfile | null> => {
    setError(null);

    try {
      const result = await upsertCVMutation(data).unwrap();
      
      if (result.data?.data) {
        return result.data.data;
      } else {
        throw new Error(result.message || "Failed to save CV");
      }
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || "Có lỗi xảy ra khi lưu CV";
      setError(errorMessage);
      return null;
    }
  }, [upsertCVMutation]);

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
    refetch,
  };
};
