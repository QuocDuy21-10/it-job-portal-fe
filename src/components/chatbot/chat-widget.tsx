"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useChat } from "@/hooks/use-chat";
import { useI18n } from "@/hooks/use-i18n";
import {
  XMarkIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/solid";
import ChatTooltip from "@/components/chatbot/chat-tooltip";
import ChatSurface from "@/components/chatbot/chat-surface";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectUser } from "@/features/auth/redux/auth.slice";

const BUTTON_SIZE = 56; // w-14 = 56px
const CHAT_WIDTH = 400;
const CHAT_HEIGHT = 600;
const EDGE_MARGIN = 20;
const DRAG_THRESHOLD = 5;
const MOBILE_BREAKPOINT = 768;

const ChatWidget = () => {
  const { isAuthenticated } = useChat();
  const { t } = useI18n();
  const user = useAppSelector(selectUser);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < MOBILE_BREAKPOINT : false
  );

  // === Drag State ===
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const isDragging = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const dragOffset = useRef({ x: 0, y: 0 });
  const totalMovement = useRef(0);
  const wasDragging = useRef(false);

  // Initialize position on mount (bottom-right)
  useEffect(() => {
    if (position === null && typeof window !== "undefined") {
      setPosition({
        x: window.innerWidth - BUTTON_SIZE - EDGE_MARGIN,
        y: window.innerHeight - BUTTON_SIZE - EDGE_MARGIN,
      });
    }
  }, [position]);

  useEffect(() => {
    const handleViewportChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    handleViewportChange();
    window.addEventListener("resize", handleViewportChange);

    return () => window.removeEventListener("resize", handleViewportChange);
  }, []);

  // Keep position in bounds on window resize
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => {
        if (!prev) return prev;
        return {
          x: Math.min(prev.x, window.innerWidth - BUTTON_SIZE - 4),
          y: Math.min(prev.y, window.innerHeight - BUTTON_SIZE - 4),
        };
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // === Drag Handlers ===
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!position) return;
      isDragging.current = true;
      totalMovement.current = 0;
      wasDragging.current = false;
      dragStartPos.current = { x: e.clientX, y: e.clientY };
      dragOffset.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [position]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;

      const dx = e.clientX - dragStartPos.current.x;
      const dy = e.clientY - dragStartPos.current.y;
      totalMovement.current = Math.sqrt(dx * dx + dy * dy);

      if (totalMovement.current > DRAG_THRESHOLD) {
        wasDragging.current = true;
      }

      const newX = Math.max(
        4,
        Math.min(window.innerWidth - BUTTON_SIZE - 4, e.clientX - dragOffset.current.x)
      );
      const newY = Math.max(
        4,
        Math.min(window.innerHeight - BUTTON_SIZE - 4, e.clientY - dragOffset.current.y)
      );

      setPosition({ x: newX, y: newY });
    },
    []
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleToggleClick = useCallback(() => {
    // Only toggle if it was a click (not a drag)
    if (!wasDragging.current) {
      setIsOpen((currentOpen) => !currentOpen);
    }
    wasDragging.current = false;
  }, []);

  // === Compute chat window position ===
  const getChatWindowStyle = useCallback((): React.CSSProperties => {
    if (!position) return {};

    const btnCenterX = position.x + BUTTON_SIZE / 2;
    const btnCenterY = position.y + BUTTON_SIZE / 2;

    // Determine horizontal placement
    let left: number;
    if (btnCenterX > window.innerWidth / 2) {
      // Button is on right half → open chat to the left
      left = position.x + BUTTON_SIZE - CHAT_WIDTH;
    } else {
      // Button is on left half → open chat to the right
      left = position.x;
    }

    // Determine vertical placement
    let top: number;
    if (btnCenterY > CHAT_HEIGHT + EDGE_MARGIN + BUTTON_SIZE) {
      // Enough space above → open above
      top = position.y - CHAT_HEIGHT - 16;
    } else {
      // Not enough space above → open below
      top = position.y + BUTTON_SIZE + 16;
    }

    // Clamp to viewport
    left = Math.max(8, Math.min(window.innerWidth - CHAT_WIDTH - 8, left));
    top = Math.max(8, Math.min(window.innerHeight - CHAT_HEIGHT - 8, top));

    return { left, top, position: "fixed" };
  }, [position]);

  if (!isMobile && !position) {
    return null;
  }

  return (
    <>
      {!isMobile && (
        <ChatSurface
          isVisible={isOpen}
          onClose={() => setIsOpen(false)}
          className="fixed"
          style={getChatWindowStyle()}
        />
      )}

      {isMobile && (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent
            side="bottom"
            className="h-dvh max-h-dvh overflow-hidden border-0 p-0 sm:max-w-none [&>button]:hidden"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>{t("chatWidget.title")}</SheetTitle>
            </SheetHeader>
            <ChatSurface
              isVisible
              onClose={() => setIsOpen(false)}
              className="h-dvh w-full rounded-none border-0 shadow-none"
            />
          </SheetContent>
        </Sheet>
      )}

      {/* Phase 1: Greeting tooltip */}
      {!isMobile && position && (
        <ChatTooltip
          position={position}
          isChatOpen={isOpen}
          isAuthenticated={isAuthenticated}
          userName={user?.name}
          onOpenChat={() => setIsOpen(true)}
        />
      )}

      {/* Draggable Toggle Button */}
      <button
        onPointerDown={isMobile ? undefined : handlePointerDown}
        onPointerMove={isMobile ? undefined : handlePointerMove}
        onPointerUp={isMobile ? undefined : handlePointerUp}
        onClick={handleToggleClick}
        aria-hidden={isOpen}
        className={`fixed z-50 flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-200 ${
          isMobile
            ? "bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 h-12 w-12 min-h-[48px] min-w-[48px]"
            : "h-14 w-14 select-none touch-none hover:shadow-xl"
        } ${isOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        style={
          isMobile || !position
            ? undefined
            : { left: position.x, top: position.y }
        }
        title={
          isOpen
            ? t("chatWidget.actions.closeChat")
            : t("chatWidget.actions.openChat")
        }
      >
        {isOpen ? (
          <XMarkIcon className="h-7 w-7 transition-transform md:h-8 md:w-8 md:group-hover:rotate-90" />
        ) : (
          <ChatBubbleLeftIcon className="h-7 w-7 transition-transform md:h-8 md:w-8 md:group-hover:scale-110" />
        )}
      </button>
    </>
  );
};

export default ChatWidget;
