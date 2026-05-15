"use client";

import { useEffect, useState } from "react";
import ChatSurface from "@/components/chatbot/chat-surface";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useI18n } from "@/hooks/use-i18n";

const MOBILE_BREAKPOINT = 768;

interface HrChatAssistantProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const HrChatAssistant = ({
  isOpen,
  onOpenChange,
}: HrChatAssistantProps) => {
  const { t } = useI18n();
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < MOBILE_BREAKPOINT : false
  );

  useEffect(() => {
    const handleViewportChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    handleViewportChange();
    window.addEventListener("resize", handleViewportChange);

    return () => window.removeEventListener("resize", handleViewportChange);
  }, []);

  return (
    <>
      {!isMobile && (
        <ChatSurface
          isVisible={isOpen}
          onClose={() => onOpenChange(false)}
          className="fixed right-4 top-20 z-30 h-[calc(100dvh-6rem)] w-[420px] max-w-[calc(100vw-2rem)]"
        />
      )}

      {isMobile && (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
          <SheetContent
            side="right"
            className="h-dvh max-h-dvh w-full max-w-none overflow-hidden border-0 p-0 sm:max-w-md [&>button]:hidden"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>{t("chatWidget.title")}</SheetTitle>
            </SheetHeader>
            <ChatSurface
              isVisible
              onClose={() => onOpenChange(false)}
              className="h-dvh w-full rounded-none border-0 shadow-none"
            />
          </SheetContent>
        </Sheet>
      )}
    </>
  );
};

export default HrChatAssistant;
