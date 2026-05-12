import Image from "next/image";
import { Link } from "@/i18n/navigation";

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
    <div className="text-center space-y-3">
      {showLogo && (
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-bold text-3xl group transition-transform hover:scale-105"
        >
          <Image
            src="/images/logo.png"
            alt="DevLink"
            width={150}
            height={45}
            className="h-20 w-auto"
            priority
          />
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
