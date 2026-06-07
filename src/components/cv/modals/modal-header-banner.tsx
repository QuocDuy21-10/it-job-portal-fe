"use client";

import { LucideIcon, Trophy, Award, GraduationCap, Languages, Code2, Cpu, Briefcase } from "lucide-react";

export type ModalBannerType = "award" | "certificate" | "education" | "language" | "project" | "skill" | "work";

interface ModalHeaderBannerProps {
  title: string;
  description: string;
  type: ModalBannerType;
}

const BANNER_CONFIG: Record<
  ModalBannerType,
  {
    icon: LucideIcon;
    bgGradient: string;
    iconBg: string;
    iconColor: string;
    borderColor: string;
    badgeText: string;
    badgeBg: string;
    badgeColor: string;
  }
> = {
  award: {
    icon: Trophy,
    bgGradient: "from-amber-500/10 via-amber-600/5 to-transparent",
    iconBg: "bg-amber-500/10 dark:bg-amber-500/20",
    iconColor: "text-amber-500 dark:text-amber-400",
    borderColor: "border-amber-500/20 dark:border-amber-500/30",
    badgeText: "Honors",
    badgeBg: "bg-amber-100 dark:bg-amber-950/50",
    badgeColor: "text-amber-800 dark:text-amber-300",
  },
  certificate: {
    icon: Award,
    bgGradient: "from-emerald-500/10 via-emerald-600/5 to-transparent",
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    iconColor: "text-emerald-500 dark:text-emerald-400",
    borderColor: "border-emerald-500/20 dark:border-emerald-500/30",
    badgeText: "Verified",
    badgeBg: "bg-emerald-100 dark:bg-emerald-950/50",
    badgeColor: "text-emerald-800 dark:text-emerald-300",
  },
  education: {
    icon: GraduationCap,
    bgGradient: "from-blue-500/10 via-indigo-600/5 to-transparent",
    iconBg: "bg-blue-500/10 dark:bg-blue-500/20",
    iconColor: "text-blue-500 dark:text-blue-400",
    borderColor: "border-blue-500/20 dark:border-blue-500/30",
    badgeText: "Academic",
    badgeBg: "bg-blue-100 dark:bg-blue-950/50",
    badgeColor: "text-blue-800 dark:text-blue-300",
  },
  language: {
    icon: Languages,
    bgGradient: "from-rose-500/10 via-pink-600/5 to-transparent",
    iconBg: "bg-rose-500/10 dark:bg-rose-500/20",
    iconColor: "text-rose-500 dark:text-rose-400",
    borderColor: "border-rose-500/20 dark:border-rose-500/30",
    badgeText: "Communication",
    badgeBg: "bg-rose-100 dark:bg-rose-950/50",
    badgeColor: "text-rose-800 dark:text-rose-300",
  },
  project: {
    icon: Code2,
    bgGradient: "from-purple-500/10 via-violet-600/5 to-transparent",
    iconBg: "bg-purple-500/10 dark:bg-purple-500/20",
    iconColor: "text-purple-500 dark:text-purple-400",
    borderColor: "border-purple-500/20 dark:border-purple-500/30",
    badgeText: "Portfolio",
    badgeBg: "bg-purple-100 dark:bg-purple-950/50",
    badgeColor: "text-purple-800 dark:text-purple-300",
  },
  skill: {
    icon: Cpu,
    bgGradient: "from-teal-500/10 via-cyan-600/5 to-transparent",
    iconBg: "bg-teal-500/10 dark:bg-teal-500/20",
    iconColor: "text-teal-500 dark:text-teal-400",
    borderColor: "border-teal-500/20 dark:border-teal-500/30",
    badgeText: "Expertise",
    badgeBg: "bg-teal-100 dark:bg-teal-950/50",
    badgeColor: "text-teal-800 dark:text-teal-300",
  },
  work: {
    icon: Briefcase,
    bgGradient: "from-orange-500/10 via-red-600/5 to-transparent",
    iconBg: "bg-orange-500/10 dark:bg-orange-500/20",
    iconColor: "text-orange-500 dark:text-orange-400",
    borderColor: "border-orange-500/20 dark:border-orange-500/30",
    badgeText: "Professional",
    badgeBg: "bg-orange-100 dark:bg-orange-950/50",
    badgeColor: "text-orange-800 dark:text-orange-300",
  },
};

export default function ModalHeaderBanner({ title, description, type }: ModalHeaderBannerProps) {
  const config = BANNER_CONFIG[type];
  const Icon = config.icon;

  return (
    <div className={`relative overflow-hidden w-full h-24 sm:h-28 md:h-32 rounded-xl bg-gradient-to-r ${config.bgGradient} p-4 sm:p-5 flex items-center justify-between border ${config.borderColor} shadow-inner transition-all duration-300 group`}>
      {/* Background abstract SVGs / decorative graphics */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 dark:opacity-20">
        {/* Floating circles */}
        <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-current filter blur-xl opacity-20 animate-pulse" style={{ color: "var(--primary)" }} />
        <div className="absolute -bottom-16 right-20 w-28 h-28 rounded-full bg-current filter blur-lg opacity-10 animate-pulse duration-3000" style={{ color: "var(--primary)" }} />

        {/* Decorative Grid */}
        <svg
          className="absolute right-0 top-0 h-full w-48 text-muted-foreground/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="grid"
              width="16"
              height="16"
              patternUnits="userSpaceOnUse"
              x="100%"
            >
              <path d="M.5 16V.5H16" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Left section: Title & Description */}
      <div className="relative z-10 flex flex-col justify-center max-w-[75%] sm:max-w-[80%] space-y-1">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${config.badgeBg} ${config.badgeColor} scale-90 sm:scale-100 origin-left`}>
            {config.badgeText}
          </span>
        </div>
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-foreground line-clamp-1">
          {title}
        </h2>
        <p className="text-[11px] sm:text-xs md:text-sm text-muted-foreground line-clamp-1 sm:line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Right section: Icon Graphic with glassmorphism glow */}
      <div className="relative z-10 flex items-center justify-center">
        <div className={`p-3 sm:p-4 rounded-xl ${config.iconBg} border ${config.borderColor} shadow-lg backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
          <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${config.iconColor} transition-transform duration-300`} />
        </div>
      </div>
    </div>
  );
}
