"use client";

import { useState } from "react";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { HrRoute } from "@/components/hr-route";
import { DashboardShell } from "@/components/admin/dashboard-shell";
import HrChatAssistant from "@/components/chatbot/hr-chat-assistant";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";

export default function HrDashboardShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useI18n();
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  return (
    <HrRoute>
      <DashboardShell
        copyrightKey="footer.hrCopyright"
        onMobileMenuOpen={() => setIsAssistantOpen(false)}
        headerAction={
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-10 gap-2"
            onClick={() => setIsAssistantOpen((currentOpen) => !currentOpen)}
            aria-pressed={isAssistantOpen}
            aria-label={t("chatWidget.title")}
          >
            <SparklesIcon className="h-4 w-4" />
            <span className="hidden sm:inline">{t("chatWidget.title")}</span>
          </Button>
        }
      >
        {children}
      </DashboardShell>

      <HrChatAssistant
        isOpen={isAssistantOpen}
        onOpenChange={setIsAssistantOpen}
      />
    </HrRoute>
  );
}
