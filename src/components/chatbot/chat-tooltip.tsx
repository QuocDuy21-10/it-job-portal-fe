"use client";

import React, { useEffect, useState, useCallback } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { SparklesIcon } from "@heroicons/react/24/outline";

const TOOLTIP_DELAY_MS = 3000;
const TOOLTIP_AUTO_DISMISS_MS = 8000;
const SESSION_KEY = "chatTooltipSeen";

const BUTTON_SIZE = 56;
const TOOLTIP_WIDTH = 240;

interface ChatTooltipProps {
  position: { x: number; y: number };
  isChatOpen: boolean;
  isAuthenticated: boolean;
  userName?: string;
  onOpenChat: () => void;
}

const ChatTooltip = ({
  position,
  isChatOpen,
  isAuthenticated,
  userName,
  onOpenChat,
}: ChatTooltipProps) => {
  const [visible, setVisible] = useState(false);

  const dismiss = useCallback(() => {
    setVisible(false);
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // sessionStorage may be unavailable in some environments
    }
  }, []);

  // Show tooltip after delay (once per session)
  useEffect(() => {
    if (isChatOpen) {
      setVisible(false);
      return;
    }

    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
    } catch {
      return;
    }

    const showTimer = setTimeout(() => {
      setVisible(true);
    }, TOOLTIP_DELAY_MS);

    return () => clearTimeout(showTimer);
  }, [isChatOpen]);

  // Auto-dismiss after 8s
  useEffect(() => {
    if (!visible) return;

    const dismissTimer = setTimeout(() => {
      dismiss();
    }, TOOLTIP_AUTO_DISMISS_MS);

    return () => clearTimeout(dismissTimer);
  }, [visible, dismiss]);

  // Hide immediately when chat opens
  useEffect(() => {
    if (isChatOpen && visible) {
      setVisible(false);
    }
  }, [isChatOpen, visible]);

  if (!visible || isChatOpen) return null;

  const tooltipMessage = isAuthenticated && userName
    ? `Xin chào ${userName}! Tôi có thể gợi ý việc làm phù hợp với bạn 💼`
    : "Muốn biết kỹ năng nào đang hot nhất? Hỏi tôi nhé! 🚀";

  // Position tooltip above and to the right of the button, clamped to viewport
  const btnCenterX = position.x + BUTTON_SIZE / 2;
  const tooltipLeft = Math.max(
    8,
    Math.min(
      typeof window !== "undefined" ? window.innerWidth - TOOLTIP_WIDTH - 8 : 0,
      btnCenterX - TOOLTIP_WIDTH / 2
    )
  );
  const tooltipTop = position.y - 12; // vertically centered near button

  return (
    <div
      className="fixed z-40 animate-in fade-in slide-in-from-bottom-2 duration-300"
      style={{
        left: tooltipLeft,
        top: tooltipTop,
        width: TOOLTIP_WIDTH,
        transform: "translateY(-100%)",
      }}
    >
      <div className="relative rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-xl dark:border-border dark:bg-card">
        {/* Dismiss button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            dismiss();
          }}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          aria-label="Đóng"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="flex items-start gap-2.5 pr-4">
          <div className="mt-0.5 flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
            <SparklesIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 mb-0.5">
              AI Career Advisor
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              {tooltipMessage}
            </p>
            <button
              onClick={() => {
                dismiss();
                onOpenChat();
              }}
              className="mt-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              Bắt đầu ngay →
            </button>
          </div>
        </div>

        {/* Caret pointing down toward the button */}
        <div
          className="absolute left-1/2 bottom-[-6px] h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-gray-200 bg-white dark:border-border dark:bg-card"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default ChatTooltip;
