import { useState, useCallback } from "react";
import { 
  useUpsertCVProfileMutation, 
  useLazyGetMyCVProfileQuery 
} from "@/features/cv-profile/redux/cv-profile.api";
import { 
  UpsertCVProfileRequest, 
  CVProfile 
} from "@/features/cv-profile/schemas/cv-profile.schema";

interface UseCV {
  isLoading: boolean;
  error: string | null;
  cvData: CVProfile | null;
  upsertCV: (data: UpsertCVProfileRequest, avatarFile?: File) => Promise<CVProfile | null>;
  fetchMyCVProfile: () => Promise<CVProfile | null>;
  clearError: () => void;
  refetch: () => Promise<CVProfile | null>;
}

/**
 * Custom Hook for CV Management using RTK Query
 * Quản lý state và logic cho CV operations
 */
export const useCV = (): UseCV => {
  const [error, setError] = useState<string | null>(null);

  const [
    triggerGetMyCVProfile,
    { data: cvProfileData, isLoading: isLoadingQuery, isFetching: isFetchingQuery },
  ] = useLazyGetMyCVProfileQuery();
  
  const [upsertCVMutation, { isLoading: isUpserting }] = useUpsertCVProfileMutation();

  const cvData = cvProfileData?.data || null;
  const isLoading = isLoadingQuery || isFetchingQuery || isUpserting;

  /**
   * Fetch current user's CV Profile
   * GET /cv-profiles/me
   * Returns saved profiles and backend-initialized drafts in the same data shape.
   */
  const fetchMyCVProfile = useCallback(async (): Promise<CVProfile | null> => {
    setError(null);

    try {
      const result = await triggerGetMyCVProfile(undefined, false).unwrap();
      
      if (result.data) {
        return result.data;
      }
      
      return null;
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || "Có lỗi xảy ra khi tải CV";
      setError(errorMessage);
      return null;
    }
  }, [triggerGetMyCVProfile]);

  /**
   * Upsert CV Profile (Create or Update)
   * POST /cv-profiles/upsert
   */
  const upsertCV = useCallback(async (data: UpsertCVProfileRequest, avatarFile?: File): Promise<CVProfile | null> => {
    setError(null);

    try {
      const result = await upsertCVMutation({ data, avatar: avatarFile }).unwrap();
      
      if (result.data) {
        return result.data;
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
    refetch: fetchMyCVProfile,
  };
};
