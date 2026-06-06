"use client";

import type { ReactNode } from "react";
import { Card } from "../ui/card";

interface CVFormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  actionButton?: ReactNode;
}

export default function CVFormSection({
  title,
  description,
  children,
  actionButton,
}: CVFormSectionProps) {
  return (
    <Card className="p-4 md:p-6 border border-border shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-4 md:mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {actionButton && <div className="ml-4 flex-shrink-0">{actionButton}</div>}
      </div>

      <div>{children}</div>
    </Card>
  );
}
