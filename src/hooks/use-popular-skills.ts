"use client";

import { useMemo } from "react";
import { useGetPopularSkillsQuery } from "@/features/skill/redux/skill.api";

export function usePopularSkills(limit: number = 10) {
  const { data, isLoading, error } = useGetPopularSkillsQuery({ limit });

  const popularSkills = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((item) => ({
      label: item.skill,
      value: item.skill,
    }));
  }, [data]);

  return { popularSkills, isLoading, error };
}
