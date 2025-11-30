import { ReactNode } from "react";
import { Briefcase } from "lucide-react";
import Link from "next/link";

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function AuthLayout({ 
  children, 
  title = "Welcome to JobPortal",
  description = "Your gateway to career opportunities. Connect with top employers and find your dream job."
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Gradient Background with Logo & Description */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800" />
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
          {/* Logo */}
          <div className="mb-8">
             <Link
                href="/"
              >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold">JobPortal</h1>
            </div>
          </Link>
            <div className="space-y-4">
              <h2 className="text-4xl font-bold leading-tight">
                {title}
              </h2>
              <p className="text-lg text-blue-100 leading-relaxed max-w-md">
                {description}
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="mt-12 space-y-4">
            {[
              "1000+ Companies hiring",
              "Verified job listings",
              "Easy application process",
              "Career growth opportunities"
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span className="text-blue-100">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12 bg-background">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
