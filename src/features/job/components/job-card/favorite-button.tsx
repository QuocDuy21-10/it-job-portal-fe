"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

export const FavoriteButton = ({
  isSaved,
  onClick,
  disabled,
  className,
}: {
  isSaved: boolean;
  onClick: (e: React.MouseEvent) => void;
  disabled: boolean;
  className?: string;
}) => {
  const { t } = useI18n();
  const label = isSaved
    ? t("jobsPage.jobCard.removeSavedJob")
    : t("jobsPage.jobCard.saveJob");

  return (
    <Tooltip.Provider delayDuration={300}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-9 w-9 rounded-full transition-all duration-200 hover:bg-primary/5 active:scale-90",
              className
            )}
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
          >
            <Heart
              className={cn(
                "h-[18px] w-[18px] transition-all duration-200",
                isSaved
                  ? "fill-primary text-primary scale-110"
                  : "fill-transparent text-muted-foreground/60 hover:text-primary/70"
              )}
            />
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            sideOffset={6}
            className="z-50 rounded-md bg-foreground px-3 py-1.5 text-xs text-background shadow-md"
          >
            {label}
            <Tooltip.Arrow className="fill-foreground" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
