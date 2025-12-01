"use client";

import React, { useEffect, useRef } from "react";
import { useChat } from "@/hooks/use-chat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  PaperAirplaneIcon,
  XMarkIcon,
  ChatBubbleLeftIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { formatChatTimestamp } from "@/lib/utils/date.utils";
import JobCard from "@/components/chatbot/job-card";

/**
 * ChatWidget Component
 * AI Chatbot widget với floating button
 * Features:
 * - Optimistic UI
 * - Markdown rendering
 * - Suggested actions (chips)
 * - Auto scroll to bottom
 * - Typing indicator
 */
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
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = React.useState("");

  // Auto scroll xuống dưới cùng khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Load history khi mở chat lần đầu
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      loadHistory();
    }
  }, [isOpen, loadHistory]);

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

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[400px] h-[600px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col border border-gray-200 dark:border-gray-700 overflow-hidden mb-4 animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="font-bold">AI Career Advisor</h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={clearChat}
                title="Xóa lịch sử"
                className="hover:bg-white/10 p-1.5 rounded-full transition-colors"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
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
                  {/* Render Markdown cho tin nhắn của Assistant */}
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
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  )}
                </div>

                {/* Recommended Jobs - Hiển thị nếu có */}
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
                <span className="text-xs text-gray-400 px-1">
                  {formatChatTimestamp(msg.timestamp)}
                </span>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg rounded-tl-none flex gap-1">
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                  <span
                    className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Actions (Chips) */}
          {suggestedActions.length > 0 && !isTyping && (
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
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Hỏi về việc làm, CV..."
                maxLength={1000}
                className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                disabled={isTyping}
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
                title="Gửi tin nhắn"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-gray-400 mt-2 text-right">
              {inputValue.length}/1000
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center group relative"
        title={isOpen ? "Đóng chat" : "Mở chat"}
      >
        {isOpen ? (
          <XMarkIcon className="w-8 h-8 transition-transform group-hover:rotate-90" />
        ) : (
          <ChatBubbleLeftIcon className="w-8 h-8 transition-transform group-hover:scale-110" />
        )}
        {/* Notification badge (có thể thêm sau) */}
        {/* <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
          3
        </span> */}
      </button>
    </div>
  );
};

export default ChatWidget;
