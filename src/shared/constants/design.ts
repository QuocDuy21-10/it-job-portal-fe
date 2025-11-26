/**
 * Design System Constants
 * Centralized design tokens for consistent UI/UX across the application
 */

export const COLORS = {
  gradient: {
    primary: "from-blue-600 to-cyan-600",
    primaryReverse: "from-cyan-600 to-blue-600",
    accent: "from-primary to-primary/60",
    subtle: "from-card via-card to-secondary/20",
    hero: "from-blue-50 via-white to-cyan-50",
    heroDark: "from-slate-900 via-slate-800 to-slate-900",
  },
  hover: {
    card: "hover:border-primary/30 hover:shadow-lg",
    button: "hover:opacity-90",
    scale: "hover:scale-[1.02]",
  },
  text: {
    gradient: "bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent",
    muted: "text-muted-foreground",
    primary: "text-primary",
  },
} as const;

export const SPACING = {
  section: {
    py: "py-12 sm:py-16 lg:py-20",
    container: "container mx-auto px-4 sm:px-6 lg:px-8",
  },
  card: {
    padding: "p-4 sm:p-6",
    gap: "gap-4 sm:gap-6",
  },
  grid: {
    default: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6",
    companies: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6",
  },
} as const;

export const TYPOGRAPHY = {
  h1: "text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight",
  h2: "text-2xl sm:text-3xl lg:text-4xl font-bold",
  h3: "text-xl sm:text-2xl font-semibold",
  body: "text-base sm:text-lg leading-relaxed",
  small: "text-sm text-muted-foreground",
  caption: "text-xs text-muted-foreground",
} as const;

export const TRANSITIONS = {
  default: "transition-all duration-300",
  fast: "transition-all duration-200",
  smooth: "transition-all duration-300 ease-in-out",
  hover: "transition-all duration-300 hover:-translate-y-1",
} as const;

export const EFFECTS = {
  cardHover: "transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1",
  buttonHover: "transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
  glassMorphism: "bg-background/80 backdrop-blur-lg border border-border/50",
  smoothShadow: "shadow-sm hover:shadow-md transition-shadow duration-300",
} as const;

export const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;
