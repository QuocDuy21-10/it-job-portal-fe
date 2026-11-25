"use client";

import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";

export function NoResults({ onClear }: { onClear: () => void }) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center gap-3 py-8 text-center">
      <SearchX
        className="h-10 w-10 text-muted-foreground"
        strokeWidth={1.75}
        aria-hidden="true"
      />
      <div className="space-y-1">
        <p className="font-medium text-foreground">
          {t("adminPages.filters.noResultsTitle")}
        </p>
        <p className="text-sm text-muted-foreground">
          {t("adminPages.filters.noResultsDescription")}
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
        className="h-11 md:h-10"
        onClick={onClear}
      >
        {t("adminPages.filters.clearFilters")}
      </Button>
    </div>
  );
}
