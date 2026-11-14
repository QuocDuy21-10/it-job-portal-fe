import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";
import createNextIntlPlugin from "next-intl/plugin";
import { buildSecurityHeaders } from "./src/lib/security/headers";
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
        headers: buildSecurityHeaders({
          apiUrl: env.API_URL,
          isProduction: process.env.NODE_ENV === "production",
        }),
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  // Reports are written to .next/analyze/; do not open browser tabs on every build.
  openAnalyzer: false,
});

export default withBundleAnalyzer(withNextIntl(nextConfig));
