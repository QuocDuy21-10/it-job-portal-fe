import { Link } from "@/i18n/navigation";
import { Briefcase } from "lucide-react";

interface AuthHeaderProps {
  showLogo?: boolean;
  title?: string;
  description?: string;
}

/**
 * AuthHeader - Unified header for auth pages
 * Displays logo, title, and description with consistent styling
 */
export function AuthHeader({ 
  showLogo = true,
  title,
  description,
}: AuthHeaderProps) {
  return (
    <div className="text-center mb-8 space-y-3">
      {showLogo && (
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-bold text-3xl mb-2 group transition-transform hover:scale-105"
        >
          <Briefcase 
            className="h-8 w-8 text-blue-600 transition-transform group-hover:rotate-12" 
            aria-hidden="true" 
          />
          <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            JobPortal
          </span>
        </Link>
      )}

      {(title || description) && (
        <div className="space-y-2">
          {title && (
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
          )}
          {description && (
            <p className="mx-auto max-w-lg text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
