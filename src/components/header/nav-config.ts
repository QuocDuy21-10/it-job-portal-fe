import {
  Bell,
  Briefcase,
  FileText,
  Mail,
  PlusCircle,
  Settings,
  User,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  labelKey: string;
  fallback: string;
  icon: LucideIcon;
  adminOnly?: boolean;
}

export const MAIN_NAV_ITEMS: readonly NavItem[] = [
  {
    href: "/jobs",
    labelKey: "nav.findJobs",
    fallback: "Find Jobs",
    icon: Briefcase,
  },
  {
    href: "/companies",
    labelKey: "nav.companies",
    fallback: "Companies",
    icon: Briefcase,
  },
];

export const USER_MENU_ITEMS: readonly NavItem[] = [
  {
    href: "/profile?tab=overview",
    labelKey: "nav.dashboard",
    fallback: "Dashboard",
    icon: User,
  },
  {
    href: "/admin",
    labelKey: "nav.adminDashboard",
    fallback: "Admin Dashboard",
    icon: Settings,
    adminOnly: true,
  },
  {
    href: "/profile?tab=my-cv",
    labelKey: "nav.myCV",
    fallback: "My CV",
    icon: FileText,
  },
  {
    href: "/profile?tab=create-cv",
    labelKey: "nav.createCV",
    fallback: "Create CV",
    icon: PlusCircle,
  },
  {
    href: "/profile?tab=my-jobs",
    labelKey: "nav.myJobs",
    fallback: "My Jobs",
    icon: Briefcase,
  },
  {
    href: "/profile?tab=email-subscription",
    labelKey: "nav.emailSubscription",
    fallback: "Email Subscription",
    icon: Mail,
  },
  {
    href: "/profile?tab=notifications",
    labelKey: "nav.notifications",
    fallback: "Notifications",
    icon: Bell,
  },
  {
    href: "/profile?tab=settings",
    labelKey: "nav.settings",
    fallback: "Settings",
    icon: Settings,
  },
];

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "vi", label: "Tiếng Việt" },
] as const;

// Which auth-dependent UI to show; computed once in Header and passed to each region.
export type HeaderAuthView = "unmounted" | "pending" | "user" | "guest";

export function isNavActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
