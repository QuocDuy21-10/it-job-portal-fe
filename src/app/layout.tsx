import "./globals.css";
import type { ReactNode } from "react";
import { headers } from "next/headers";
import { Be_Vietnam_Pro, Inter } from "next/font/google";
import { getLocale } from "next-intl/server";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import ReduxProvider from "@/lib/redux/provider";
import { CaslProvider } from "@/lib/casl/casl-provider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NonceProvider } from "@/contexts/nonce-context";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  // One variable file covers every weight, including 600 for font-semibold.
  variable: "--font-inter",
  display: "swap",
});

// Heading font (DESIGN.md): static weights only, 600 and 700.
const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["600", "700"],
  variable: "--font-heading",
  display: "swap",
});

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = await getLocale();
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${beVietnamPro.variable} font-sans flex min-h-screen flex-col`}
      >
        <ReduxProvider>
          <CaslProvider>
            <NonceProvider nonce={nonce}>
              <ThemeProvider nonce={nonce}>
                {children}
                <Toaster />
              </ThemeProvider>
            </NonceProvider>
          </CaslProvider>
        </ReduxProvider>
        {/* Real-user Web Vitals; enabled per project in the Vercel dashboard. */}
        <SpeedInsights />
      </body>
    </html>
  );
}
