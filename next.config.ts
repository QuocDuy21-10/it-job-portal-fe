import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    authInterrupts: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Thêm đoạn này
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups', // Đổi từ 'same-origin' thành giá trị này
          },
          {
            key: 'Referrer-Policy',
            value: 'no-referrer-when-downgrade', // Cho môi trường dev với http/localhost
          },
        ],
      },
    ];
  },
};

export default nextConfig;
