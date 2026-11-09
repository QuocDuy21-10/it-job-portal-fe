import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { env } from "./src/shared/config/env";

const apiUrl = new URL(env.API_URL);

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    remotePatterns: [
      {
        protocol: apiUrl.protocol === "https:" ? "https" : "http",
        hostname: apiUrl.hostname,
        port: apiUrl.port,
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
          {
            key: "Referrer-Policy",
            value: "no-referrer-when-downgrade",
          },
        ],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
