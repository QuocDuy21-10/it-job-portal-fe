"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log lỗi lên monitoring service
    console.error("Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <AlertTriangle className="w-20 h-20 text-yellow-500 mx-auto" />

        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Có lỗi xảy ra
          </h2>
          <p className="text-gray-600">
            Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.
          </p>
        </div>

        <div className="space-y-3">
          <Button onClick={reset} className="w-full">
            Thử lại
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
          >
            Về trang chủ
          </Button>
        </div>

        {process.env.NODE_ENV === "development" && (
          <details className="text-left text-sm bg-gray-100 p-4 rounded">
            <summary className="cursor-pointer font-medium">
              Chi tiết lỗi (Dev only)
            </summary>
            <pre className="mt-2 whitespace-pre-wrap break-words">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
