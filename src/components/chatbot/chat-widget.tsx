"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useChat } from "@/hooks/use-chat";
import { useAuthModal } from "@/contexts/auth-modal-context";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  PaperAirplaneIcon,
  XMarkIcon,
  ChatBubbleLeftIcon,
  TrashIcon,
  StopIcon,
} from "@heroicons/react/24/solid";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import { formatChatTimestamp } from "@/lib/utils/date.utils";
import JobCard from "@/components/chatbot/job-card";

const BUTTON_SIZE = 56; // w-14 = 56px
const CHAT_WIDTH = 400;
const CHAT_HEIGHT = 600;
const EDGE_MARGIN = 20;
const DRAG_THRESHOLD = 5;

const ChatSkeletonBubble = () => (
  <div className="flex justify-start">
    <div className="max-w-[85%] p-3 rounded-lg rounded-tl-none bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-sm space-y-2">
      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-3/4" />
      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-full" />
      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-1/2" />
    </div>
  </div>
);

const ChatWidget = () => {
  const {
    messages,
    isTyping,
    suggestedActions,
    isOpen,
    setIsOpen,
    sendMessage,
    loadHistory,
    clearChat,
    isAuthenticated,
    isStreaming,
    streamingContent,
    streamingMessageId,
    abortStream,
  } = useChat();
  const { openModal } = useAuthModal();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");

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
      setIsOpen(!isOpen);
    }
    wasDragging.current = false;
  }, [isOpen, setIsOpen]);

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

  // Auto scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, streamingContent]);

  // Load history when opening chat (authenticated only)
  useEffect(() => {
    if (isOpen && messages.length === 0 && isAuthenticated) {
      loadHistory();
    }
  }, [isOpen, isAuthenticated, loadHistory]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedAction = (action: string) => {
    sendMessage(action);
  };

  const handleLoginClick = () => {
    setIsOpen(false);
    openModal("signin");
  };

  // Don't render until we have a position
  if (!position) return null;

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div
          className="w-[400px] h-[600px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-in slide-in-from-bottom-5 duration-300"
          style={getChatWindowStyle()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="font-bold">AI Career Advisor</h3>
            </div>
            <div className="flex gap-2">
              {isAuthenticated && (
                <button
                  onClick={clearChat}
                  title="Xóa lịch sử"
                  className="hover:bg-white/10 p-1.5 rounded-full transition-colors"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/10 p-1.5 rounded-full transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
            {/* Guest Mode: Login Prompt */}
            {!isAuthenticated ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-4">
                  <LockClosedIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  Đăng nhập để sử dụng AI Chat
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Hãy đăng nhập để được tư vấn nghề nghiệp, phân tích CV và nhận gợi ý việc làm phù hợp.
                </p>
                <button
                  onClick={handleLoginClick}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-blue-700 transition-colors text-sm"
                >
                  Đăng nhập ngay
                </button>
              </div>
            ) : (
              <>
                {/* Authenticated: Normal chat */}
                {messages.length === 0 && !isTyping && (
                  <div className="text-center text-gray-400 mt-10 text-sm px-4">
                    <div className="text-4xl mb-3">👋</div>
                    <p className="font-medium">Chào bạn!</p>
                    <p className="text-xs mt-2">
                      Tôi có thể giúp gì cho CV và sự nghiệp của bạn hôm nay?
                    </p>
                  </div>
                )}

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col gap-1 ${
                      msg.role === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-lg text-sm shadow-sm ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white rounded-tr-none"
                          : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-tl-none"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              ul: ({ node, ...props }) => (
                                <ul className="list-disc pl-4 space-y-0.5" {...props} />
                              ),
                              ol: ({ node, ...props }) => (
                                <ol className="list-decimal pl-4 space-y-0.5" {...props} />
                              ),
                              a: ({ node, ...props }) => (
                                <a
                                  className="text-blue-600 dark:text-blue-400 hover:underline"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  {...props}
                                />
                              ),
                              p: ({ node, ...props }) => (
                                <p className="mb-1 last:mb-0" {...props} />
                              ),
                              strong: ({ node, ...props }) => (
                                <strong className="font-semibold" {...props} />
                              ),
                            }}
                          >
                            {msg.id === streamingMessageId
                              ? streamingContent || "..."
                              : msg.content}
                          </ReactMarkdown>
                          {msg.id === streamingMessageId && (
                            <span className="inline-block w-1.5 h-4 bg-gray-400 dark:bg-gray-300 animate-pulse ml-0.5 align-text-bottom" />
                          )}
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                      )}
                    </div>

                    {/* Recommended Jobs */}
                    {msg.role === "assistant" && msg.recommendedJobs && msg.recommendedJobs.length > 0 && (
                      <div className="w-full max-w-[85%]">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 px-1">
                          💼 Công việc gợi ý cho bạn:
                        </p>
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                          {msg.recommendedJobs.map((job) => (
                            <JobCard key={job._id} job={job} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Timestamp */}
                    {msg.id !== streamingMessageId && (
                      <span className="text-xs text-gray-400 px-1">
                        {formatChatTimestamp(msg.timestamp)}
                      </span>
                    )}
                  </div>
                ))}

                {/* Skeleton — POST wait (before streaming starts) */}
                {isTyping && !isStreaming && <ChatSkeletonBubble />}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Suggested Actions (Chips) - only for authenticated, hide during streaming */}
          {isAuthenticated && suggestedActions.length > 0 && !isTyping && !isStreaming && (
            <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
              {suggestedActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestedAction(action)}
                  className="whitespace-nowrap text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors flex-shrink-0"
                >
                  {action}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            {isAuthenticated ? (
              <>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Hỏi về việc làm, CV..."
                    maxLength={1000}
                    className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    disabled={isTyping || isStreaming}
                  />
                  {isStreaming ? (
                    <button
                      onClick={abortStream}
                      className="bg-red-500 text-white p-2.5 rounded-full hover:bg-red-600 transition-colors flex-shrink-0"
                      title="Dừng tạo phản hồi"
                    >
                      <StopIcon className="w-5 h-5" />
                    </button>
                  ) : isTyping ? (
                    <button
                      disabled
                      className="bg-gray-300 dark:bg-gray-700 text-white p-2.5 rounded-full flex-shrink-0 cursor-not-allowed"
                      title="Đang xử lý..."
                    >
                      <svg
                        className="w-5 h-5 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                    </button>
                  ) : (
                    <button
                      onClick={handleSend}
                      disabled={!inputValue.trim()}
                      className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                      title="Gửi tin nhắn"
                    >
                      <PaperAirplaneIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <div className="text-xs text-gray-400 mt-2 text-right">
                  {inputValue.length}/1000
                </div>
              </>
            ) : (
              <div className="text-center py-1">
                <button
                  onClick={handleLoginClick}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Đăng nhập để bắt đầu trò chuyện →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Draggable Toggle Button */}
      <button
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={handleToggleClick}
        aria-hidden={isOpen}
        className={`fixed z-50 w-14 h-14 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center group select-none touch-none transition-all duration-200 ${isOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        style={{ left: position.x, top: position.y }}
        title={isOpen ? "Đóng chat" : "Mở chat"}
      >
        {isOpen ? (
          <XMarkIcon className="w-8 h-8 transition-transform group-hover:rotate-90" />
        ) : (
          <ChatBubbleLeftIcon className="w-8 h-8 transition-transform group-hover:scale-110" />
        )}
      </button>
    </>
  );
};

export default ChatWidget;
