import Link from "next/link";
import { Search, Home, ArrowLeft, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Animation */}
        <div className="relative mb-8">
          <h1 className="text-[180px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 leading-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-blue-100 rounded-full animate-ping opacity-20"></div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 mb-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">
              Trang không tồn tại
            </h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Rất tiếc, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm. Có
              thể trang đã bị xóa hoặc URL không chính xác.
            </p>
          </div>

          {/* Suggestions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-md mx-auto">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Bạn có thể thử:
            </p>
            <ul className="text-left space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Kiểm tra lại đường dẫn URL</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Quay lại trang trước đó</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Tìm kiếm công việc mới nhất</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full sm:w-auto"
          >
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Về trang chủ
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            <Link href="/jobs" className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Tìm việc làm
            </Link>
          </Button>

          <Button
            onClick={() => window.history.back()}
            variant="ghost"
            size="lg"
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mt-12 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm công việc..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  const value = (e.target as HTMLInputElement).value;
                  if (value.trim()) {
                    window.location.href = `/jobs?q=${encodeURIComponent(
                      value
                    )}`;
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Footer Text */}
        <p className="mt-8 text-sm text-gray-500">
          Mã lỗi: 404 - Page Not Found
        </p>
      </div>
    </div>
  );
}
