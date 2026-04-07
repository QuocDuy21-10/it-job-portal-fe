"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectUserRole } from "@/features/auth/redux/auth.slice";
import { AppAbility, defineAbilityFor } from "./ability";

const AbilityContext = createContext<AppAbility>(defineAbilityFor());

export function CaslProvider({ children }: { children: React.ReactNode }) {
  const roleName = useAppSelector(selectUserRole);

  const ability = useMemo(() => defineAbilityFor(roleName), [roleName]);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
}

export function useAbility(): AppAbility {
  return useContext(AbilityContext);
}
