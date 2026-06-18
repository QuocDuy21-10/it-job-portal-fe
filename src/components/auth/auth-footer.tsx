"use client";

import Link from "next/link";
import { useI18n } from "@/hooks/use-i18n";

interface AuthFooterLink {
  text: string;
  href: string;
  highlight?: boolean;
}

interface AuthFooterProps {
  message: string;
  link: AuthFooterLink;
  showLegalLinks?: boolean;
}

/**
 * AuthFooter - Unified footer for auth pages
 * Displays navigation links and legal information
 */
export function AuthFooter({ message, link, showLegalLinks = true }: AuthFooterProps) {
  const { t } = useI18n();

  return (
    <>
      {/* Navigation Link */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {message}{" "}
          <Link
            href={link.href}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors underline-offset-4 hover:underline"
          >
            {link.text}
          </Link>
        </p>
      </div>

      {/* Legal Links */}
      {showLegalLinks && (
        <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-6 leading-relaxed">
          {t("authModal.footer.legalPrefix")}{" "}
          <Link
            href="/terms"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors hover:underline underline-offset-2"
          >
            {t("authModal.register.fields.acceptTerms.terms")}
          </Link>{" "}
          {t("authModal.footer.legalAnd")}{" "}
          <Link
            href="/privacy"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors hover:underline underline-offset-2"
          >
            {t("authModal.register.fields.acceptTerms.privacy")}
          </Link>
        </p>
      )}
    </>
  );
}
