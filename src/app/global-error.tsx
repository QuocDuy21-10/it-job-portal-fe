"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <CardTitle className="text-red-600 dark:text-red-400">
                Lỗi nghiêm trọng
              </CardTitle>
              <CardDescription>
                Ứng dụng gặp sự cố không mong muốn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-sm text-muted-foreground">
                Mã lỗi: {error.digest?.slice(0, 8).toUpperCase() || "CRITICAL"}
              </div>

              <div className="flex flex-col gap-2">
                <Button onClick={reset} className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Khởi động lại ứng dụng
                </Button>
                <Button
                  onClick={() => (window.location.href = "/")}
                  variant="outline"
                  className="w-full"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Về trang chủ
                </Button>
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Nếu vấn đề vẫn tiếp tục, vui lòng liên hệ hỗ trợ
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  );
}
