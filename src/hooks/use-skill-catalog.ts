"use client";

import { useMemo } from "react";
import { useGetSkillCatalogQuery } from "@/features/skill/redux/skill.api";

export function useSkillCatalog() {
  const { data, isLoading, error } = useGetSkillCatalogQuery({ limit: 200 });

  const skillOptions = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((item) => ({
      label: item.label,
      value: item.label,
    }));
  }, [data]);

  return { skillOptions, isLoading, error };
}
