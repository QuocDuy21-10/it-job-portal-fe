import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/contexts/i18n-provider";
import { ClientLayout } from "@/components/client-layout";
import ReduxProvider from "@/lib/redux/provider";
import { GoogleOAuthProvider } from "@/components/google-oauth-provider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "arial"],
  preload: true,
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

// Static metadata - fallback cho SEO
export const metadata: Metadata = {
  title: "JobPortal - Find Your Dream Job",
  description:
    "Connecting talented professionals with amazing opportunities worldwide. Browse thousands of jobs from top companies.",
  keywords: "jobs, careers, employment, recruitment, job search, hiring",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} flex min-h-screen flex-col`}>
        <ReduxProvider>
          <GoogleOAuthProvider>
            <ThemeProvider>
              <I18nProvider>
                <ClientLayout />
                {/* <Header /> */}
                <main className="flex-1">{children}</main>
                {/* <Footer /> */}
                <Toaster />
              </I18nProvider>
            </ThemeProvider>
          </GoogleOAuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
