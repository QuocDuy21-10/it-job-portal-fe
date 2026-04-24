"use client";

import Link from "next/link";
import { Home, ArrowLeft, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

const NOT_FOUND_MESSAGES = {
  en: {
    title: "Page not found",
    description:
      "We couldn't find the page you're looking for. The page may have been removed or the URL may be incorrect.",
    suggestionsTitle: "You can try:",
    suggestions: [
      "Checking the URL again",
      "Going back to the previous page",
    ],
    home: "Back to home",
    jobs: "Browse jobs",
    back: "Go back",
    errorCode: "Error code: 404 - Page Not Found",
  },
  vi: {
    title: "Trang không tồn tại",
    description:
      "Rất tiếc, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm. Có thể trang đã bị xóa hoặc URL không chính xác.",
    suggestionsTitle: "Bạn có thể thử:",
    suggestions: [
      "Kiểm tra lại đường dẫn URL",
      "Quay lại trang trước đó",
    ],
    home: "Về trang chủ",
    jobs: "Tìm việc làm",
    back: "Quay lại",
    errorCode: "Mã lỗi: 404 - Không tìm thấy trang",
  },
} as const;

function getLocaleFromPath(pathname: string | null) {
  const firstSegment = pathname?.split("/").filter(Boolean)[0];

  return firstSegment === "vi" ? "vi" : "en";
}

export default function NotFound() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const messages = NOT_FOUND_MESSAGES[locale];
  const baseHref = locale === "vi" ? "/vi" : "/";
  const jobsHref = locale === "vi" ? "/vi/jobs" : "/jobs";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Animation */}
        <div className="relative mb-8">
          <h1 className="text-[100px] font-bold text-transparent bg-clip-text bg-primary leading-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-blue-100 rounded-full animate-ping opacity-20"></div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 mb-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">{messages.title}</h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              {messages.description}
            </p>
          </div>

          {/* Suggestions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-md mx-auto">
            <p className="text-sm font-medium text-gray-700 mb-3">
              {messages.suggestionsTitle}
            </p>
            <ul className="text-left space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>{messages.suggestions[0]}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mt-0.5 mr-2">•</span>
                <span>{messages.suggestions[1]}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
          >
            <Link href={baseHref} className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              {messages.home}
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            <Link href={jobsHref} className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              {messages.jobs}
            </Link>
          </Button>

          <Button
            onClick={() => window.history.back()}
            variant="ghost"
            size="lg"
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {messages.back}
          </Button>
        </div>

        {/* Footer Text */}
        <p className="mt-8 text-sm text-gray-500">
          {messages.errorCode}
        </p>
      </div>
    </div>
  );
}
