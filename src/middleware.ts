// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Lấy token hoặc session
  const token = request.cookies.get("token")?.value;
  const userRole = request.cookies.get("role")?.value;

  // Danh sách route cần bảo vệ
  const protectedRoutes = ["/dashboard", "/post-job", "/admin"];
  const employerOnlyRoutes = ["/post-job", "/manage-jobs"];

  const path = request.nextUrl.pathname;

  // Kiểm tra route cần đăng nhập
  if (protectedRoutes.some((route) => path.startsWith(route))) {
    if (!token) {
      // Chưa đăng nhập -> redirect sang 403
      return NextResponse.redirect(new URL("/403", request.url));
    }
  }

  // Kiểm tra route dành cho nhà tuyển dụng
  if (employerOnlyRoutes.some((route) => path.startsWith(route))) {
    if (userRole !== "employer") {
      return NextResponse.redirect(new URL("/403", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
