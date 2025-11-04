"use client";

import Link from "next/link";
import { ShieldAlert, Home, ArrowLeft, LogIn, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Forbidden() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 403 Icon */}
        <div className="relative mb-8 flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
              <ShieldAlert className="w-20 h-20 text-red-600" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 border-4 border-red-200 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>
        </div>

        <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 mb-4">
          403
        </h1>

        {/* Content */}
        <div className="space-y-6 mb-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">
              Truy cập bị từ chối
            </h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Bạn không có quyền truy cập vào trang này. Vui lòng kiểm tra lại
              quyền hạn của tài khoản hoặc liên hệ quản trị viên.
            </p>
          </div>

          {/* Reasons */}
          {/* <div className="bg-white rounded-lg shadow-sm border border-red-100 p-6 max-w-md mx-auto">
            <p className="text-sm font-medium text-gray-700 mb-3 flex items-center justify-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              Có thể do:
            </p>
            <ul className="text-left space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>Bạn chưa đăng nhập vào hệ thống</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>Tài khoản của bạn không có quyền truy cập</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>Trang này dành riêng cho nhà tuyển dụng/ứng viên</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>Phiên đăng nhập của bạn đã hết hạn</span>
              </li>
            </ul>
          </div> */}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 w-full sm:w-auto"
          >
            <Link href="/login" className="flex items-center gap-2">
              <LogIn className="w-5 h-5" />
              Đăng nhập
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Về trang chủ
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

        {/* Help Section */}
        <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg max-w-md mx-auto">
          <p className="text-sm font-medium text-gray-700 mb-3">Cần hỗ trợ?</p>
          <p className="text-sm text-gray-600 mb-4">
            Nếu bạn cho rằng đây là lỗi, vui lòng liên hệ với chúng tôi
          </p>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
          >
            <Link href="/contact" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Liên hệ hỗ trợ
            </Link>
          </Button>
        </div>

        {/* Footer Text */}
        <p className="mt-8 text-sm text-gray-500">
          Mã lỗi: 403 - Forbidden Access
        </p>
      </div>
    </div>
  );
}
