"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ChatAiDisclaimer from "@/features/chatbot/components/chat-ai-disclaimer";
import { useI18n } from "@/hooks/use-i18n";

export interface ChatFeatureCard {
  id: string;
  emoji: string;
  title: string;
  desc: string;
}

interface ChatWelcomeProps {
  greetingMessage: string;
  featureCards: ChatFeatureCard[];
}

const ChatWelcome = ({ greetingMessage, featureCards }: ChatWelcomeProps) => {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2">
        <div className="mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700">
          <span className="text-xs font-bold text-white">AI</span>
        </div>
        <div className="max-w-[85%] rounded-lg rounded-tl-none border border-gray-200 bg-white p-3 text-sm text-gray-800 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
          <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {greetingMessage}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 px-1">
        {featureCards.map((feature) => (
          <div
            key={feature.id}
            className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5 dark:border-gray-600 dark:bg-gray-700/50"
          >
            <span className="text-lg leading-none">{feature.emoji}</span>
            <div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-200">
                {feature.title}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {feature.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <ChatAiDisclaimer variant="welcome">
        {t("chatWidget.disclaimer.default")}
      </ChatAiDisclaimer>
    </div>
  );
};

export default ChatWelcome;
