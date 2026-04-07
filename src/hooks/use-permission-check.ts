import { useMemo, useCallback } from "react";
import { useAbility } from "@/lib/casl/casl-provider";
import { EAction } from "@/lib/casl/ability";
import type { ESubject } from "@/lib/casl/ability";
import type { NavigationItem } from "@/shared/config/admin-navigation";

export function usePermissionCheck() {
  const ability = useAbility();

  const checkPermission = useCallback(
    (subject: ESubject, action: EAction = EAction.READ) => {
      return ability.can(action, subject);
    },
    [ability]
  );

  const canAccessModule = useCallback(
    (subject: ESubject) => {
      return ability.can(EAction.READ, subject);
    },
    [ability]
  );

  const filterNavigation = useCallback(
    (items: NavigationItem[]) => {
      return items.filter((item) => {
        if (!item.subject) return true;
        return ability.can(EAction.READ, item.subject);
      });
    },
    [ability]
  );

  return {
    ability,
    checkPermission,
    canAccessModule,
    filterNavigation,
  };
}

export function useFilteredNavigation(items: NavigationItem[]) {
  const { filterNavigation } = usePermissionCheck();
  return useMemo(() => filterNavigation(items), [filterNavigation, items]);
}
