import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

// Static metadata - fallback cho SEO
export const metadata: Metadata = {
  title: "JobPortal - Find Your Dream Job",
  description:
    "Connecting talented professionals with amazing opportunities worldwide. Browse thousands of jobs from top companies.",
  keywords: "jobs, careers, employment, recruitment, job search, hiring",
};

/**
 * Main Layout
 * Layout cho các trang public (home, jobs, companies, etc.)
 * ReduxProvider, ThemeProvider, I18nProvider đã được wrap ở root layout
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
