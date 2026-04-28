import "./globals.css";
import type { ReactNode } from "react";
import { Roboto } from "next/font/google";
import { getLocale } from "next-intl/server";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import ReduxProvider from "@/lib/redux/provider";
import { CaslProvider } from "@/lib/casl/casl-provider";
import { GoogleOAuthProvider } from "@/components/google-oauth-provider";

const roboto = Roboto({
  subsets: ["latin", "vietnamese"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
});

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${roboto.variable} font-sans flex min-h-screen flex-col`}>
        <ReduxProvider>
          <CaslProvider>
            <GoogleOAuthProvider>
              <ThemeProvider>
                {children}
                <Toaster />
              </ThemeProvider>
            </GoogleOAuthProvider>
          </CaslProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
