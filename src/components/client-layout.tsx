"use client";

import { useEffect } from "react";
import { useI18n } from "@/hooks/use-i18n";

export function ClientLayout() {
  const { t, mounted } = useI18n();

  useEffect(() => {
    if (mounted) {
      // Update document title
      document.title = t("meta.title");

      // Update meta description
      const metaDescription = document.querySelector(
        'meta[name="description"]'
      );
      if (metaDescription) {
        metaDescription.setAttribute("content", t("meta.description"));
      }

      // Update meta keywords
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute("content", t("meta.keywords"));
      }
    }
  }, [mounted, t]);

  return null;
}
