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
    <Card className="p-6 border border-border">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {actionButton && <div className="ml-4">{actionButton}</div>}
      </div>

      <div>{children}</div>
    </Card>
  );
}
