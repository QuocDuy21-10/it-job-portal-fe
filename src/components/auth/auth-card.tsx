import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthCardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

/**
 * AuthCard - Unified card wrapper for auth forms
 * Provides consistent styling, shadow, and spacing
 */
export function AuthCard({ title, description, children, className = "" }: AuthCardProps) {
  return (
    <Card className={`shadow-xl border-0 backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 ${className}`}>
      {(title || description) && (
        <CardHeader className="space-y-1 pb-4">
          {title && (
            <CardTitle className="text-xl font-semibold dark:text-white">
              {title}
            </CardTitle>
          )}
          {description && (
            <CardDescription className="text-sm dark:text-gray-400">
              {description}
            </CardDescription>
          )}
        </CardHeader>
      )}
      <CardContent className={title || description ? "pt-0" : ""}>
        {children}
      </CardContent>
    </Card>
  );
}
