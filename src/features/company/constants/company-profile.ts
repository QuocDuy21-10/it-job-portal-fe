import {
  Banknote,
  Clock,
  Gift,
  GraduationCap,
  HeartPulse,
  House,
  Laptop,
  Palmtree,
  PieChart,
  TrendingUp,
  Trophy,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

// Same keys and order as the backend enums ECompanyIndustry / ECompanyBenefit.
export const COMPANY_INDUSTRIES = [
  "SOFTWARE_PRODUCT",
  "IT_OUTSOURCING",
  "IT_CONSULTING",
  "FINTECH_BANKING",
  "ECOMMERCE_RETAIL",
  "TELECOM",
  "GAMING",
  "EDTECH",
  "HEALTHTECH",
  "LOGISTICS",
  "HARDWARE_IOT",
  "MEDIA_MARKETING",
  "OTHER",
] as const;

export const COMPANY_BENEFITS = [
  "HEALTH_INSURANCE",
  "THIRTEENTH_MONTH_SALARY",
  "PERFORMANCE_BONUS",
  "SALARY_REVIEW",
  "REMOTE_HYBRID",
  "FLEXIBLE_HOURS",
  "LAPTOP_EQUIPMENT",
  "TRAINING_BUDGET",
  "PAID_LEAVE",
  "TEAM_BUILDING",
  "MEALS_ALLOWANCE",
  "STOCK_OPTIONS",
  "OTHER",
] as const;

export type CompanyIndustry = (typeof COMPANY_INDUSTRIES)[number];
export type CompanyBenefitType = (typeof COMPANY_BENEFITS)[number];
export type CompanyBenefitItem = {
  type: CompanyBenefitType;
  note?: string | null;
};

export const MAX_TECH_STACK = 20;
export const MAX_BENEFITS = 12;
export const MAX_BENEFIT_NOTE_LENGTH = 120;

export const BENEFIT_ICONS: Record<CompanyBenefitType, LucideIcon> = {
  HEALTH_INSURANCE: HeartPulse,
  THIRTEENTH_MONTH_SALARY: Banknote,
  PERFORMANCE_BONUS: Trophy,
  SALARY_REVIEW: TrendingUp,
  REMOTE_HYBRID: House,
  FLEXIBLE_HOURS: Clock,
  LAPTOP_EQUIPMENT: Laptop,
  TRAINING_BUDGET: GraduationCap,
  PAID_LEAVE: Palmtree,
  TEAM_BUILDING: Users,
  MEALS_ALLOWANCE: UtensilsCrossed,
  STOCK_OPTIONS: PieChart,
  OTHER: Gift,
};
