import { dateFilter } from "@/components/admin/list/list-params";
import type { ListConfig, ListValues } from "@/components/admin/list/types";
import { useCompanySearchOptions } from "@/features/company/hooks/use-company-search-options";
import { equals } from "@/lib/utils/list-url";
import { ROLES } from "@/shared/constants/role-values";
import type { Translate } from "@/shared/types/i18n";
import type { PaginatedQueryParams } from "@/shared/types/pagination";

const LOCKED = "LOCKED";

export function buildUserListConfig(t: Translate): ListConfig {
  const tab = (key: string) => t(`adminPages.users.tabs.${key}`);
  const label = (key: string) => t(`adminPages.users.filters.${key}`);

  return {
    tabs: [
      { value: "", label: tab("all") },
      { value: ROLES.NORMAL_USER, label: tab("candidate") },
      { value: ROLES.HR, label: tab("hr") },
      { value: ROLES.SUPER_ADMIN, label: tab("admin") },
      { value: LOCKED, label: tab("locked") },
    ],
    fields: [
      {
        key: "verified",
        label: label("verified"),
        type: "select",
        options: [
          { value: "true", label: label("verifiedYes") },
          { value: "false", label: label("verifiedNo") },
        ],
      },
      {
        key: "provider",
        label: label("provider"),
        type: "select",
        options: [
          { value: "local", label: label("providerLocal") },
          { value: "google", label: label("providerGoogle") },
        ],
      },
      {
        key: "company",
        label: t("adminPages.filters.company"),
        type: "entity",
        useOptions: useCompanySearchOptions,
      },
      {
        key: "created",
        label: t("adminPages.filters.createdAt"),
        type: "date",
      },
    ],
    sorts: [
      { value: "-createdAt", label: t("adminPages.filters.newest") },
      { value: "createdAt", label: t("adminPages.filters.oldest") },
      { value: "name", label: label("nameAz") },
    ],
    defaultPageSize: 10,
  };
}

export function toUserQuery({
  q,
  tab,
  sort,
  page,
  limit,
  filters,
}: ListValues): PaginatedQueryParams {
  return {
    page,
    limit,
    sort: `sort=${sort}`,
    keyword: q,
    filter: [
      ...(tab === LOCKED ? ["isLocked=true"] : equals("role", tab)),
      ...equals("isActive", filters.verified),
      ...equals("authProvider", filters.provider),
      ...equals("company._id", filters.company),
      ...dateFilter("createdAt", filters.created),
    ].join("&"),
  };
}
