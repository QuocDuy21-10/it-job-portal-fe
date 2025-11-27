import "./globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/contexts/i18n-provider";
import { AuthModalProvider } from "@/contexts/auth-modal-context";
import { ClientLayout } from "@/components/client-layout";
import { AuthModal } from "@/components/modals/auth-modal";
import { AuthInitializer } from "@/components/auth-initializer";
import ReduxProvider from "@/lib/redux/provider";
import { GoogleOAuthProvider } from "@/components/google-oauth-provider";

const roboto = Roboto({
  subsets: ["latin", "vietnamese"], 
  weight: ["100", "300", "400", "500", "700", "900"], 
  variable: "--font-roboto", 
  display: "swap", 
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
     <body className={`${roboto.variable} font-sans flex min-h-screen flex-col`}>
        <ReduxProvider>
          <GoogleOAuthProvider>
            <ThemeProvider>
              <I18nProvider>
                <AuthModalProvider>
                  {/* Fetch user data on app initialization */}
                  <AuthInitializer />
                  <ClientLayout />
                  {/* <Header /> */}
                  <main className="flex-1">{children}</main>
                  {/* <Footer /> */}
                  <AuthModal />
                  <Toaster />
                </AuthModalProvider>
              </I18nProvider>
            </ThemeProvider>
          </GoogleOAuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
