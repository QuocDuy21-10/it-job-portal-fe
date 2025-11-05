"use client";

import {
  useGetSubscriberSkillsQuery,
  useUpdateSubscriberMutation,
} from "@/features/subscriber/redux/subscriber.api";

export function useSubscriber() {
  const {
    data: subscriberSkillsData,
    isLoading: isLoadingSkills,
    error: skillsError,
    refetch,
  } = useGetSubscriberSkillsQuery();

  const [updateSubscriber, { isLoading: isUpdating, error: updateError }] =
    useUpdateSubscriberMutation();

  const skills = subscriberSkillsData?.data?.skills || [];

  return {
    skills,
    isLoadingSkills,
    skillsError,
    updateSubscriber,
    isUpdating,
    updateError,
    refetch,
  };
}
