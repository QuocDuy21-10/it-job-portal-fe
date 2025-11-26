import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TYPOGRAPHY } from "@/shared/constants/design";

interface SectionHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  showAction?: boolean;
}

export function SectionHeader({
  title,
  description,
  actionLabel,
  actionHref,
  showAction = true,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8 sm:mb-12">
      <div>
        <h2 className={TYPOGRAPHY.h2}>{title}</h2>
        {description && (
          <p className="text-muted-foreground mt-2">{description}</p>
        )}
      </div>
      {showAction && actionLabel && actionHref && (
        <Button asChild variant="outline" className="hidden sm:flex">
          <Link href={actionHref}>
            {actionLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      )}
    </div>
  );
}
