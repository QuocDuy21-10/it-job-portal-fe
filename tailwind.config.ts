import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "360px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1440px",
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        "text-tertiary": "hsl(var(--text-tertiary))",
        "primary-hover": "hsl(var(--primary-hover))",
        "primary-subtle": "hsl(var(--primary-subtle))",
        // Not shadcn secondary/accent: those stay neutral for now (see DESIGN.md).
        "brand-secondary": "hsl(var(--brand-secondary))",
        highlight: "hsl(var(--highlight))",
        "accent-subtle": {
          DEFAULT: "hsl(var(--accent-subtle))",
          foreground: "hsl(var(--accent-subtle-foreground))",
        },
        "surface-brand-strong": "hsl(var(--surface-brand-strong))",
        success: {
          DEFAULT: "hsl(var(--success))",
          bg: "hsl(var(--success-bg))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          bg: "hsl(var(--warning-bg))",
        },
        error: {
          DEFAULT: "hsl(var(--error))",
          bg: "hsl(var(--error-bg))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          bg: "hsl(var(--info-bg))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
        heading: [
          "var(--font-heading)",
          "var(--font-inter)",
          ...fontFamily.sans,
        ],
        mono: ["JetBrains Mono", ...fontFamily.mono],
      },
      fontSize: {
        display: ["3rem", { lineHeight: "3.5rem", fontWeight: "700" }],
        h1: ["2rem", { lineHeight: "2.5rem", fontWeight: "700" }],
        h2: ["1.5rem", { lineHeight: "2rem", fontWeight: "700" }],
        h3: ["1.25rem", { lineHeight: "1.75rem", fontWeight: "600" }],
        h4: ["1.125rem", { lineHeight: "1.625rem", fontWeight: "600" }],
        "body-lg": ["1.125rem", { lineHeight: "1.75rem" }],
        body: ["1rem", { lineHeight: "1.5rem" }],
        "body-sm": ["0.875rem", { lineHeight: "1.25rem" }],
        label: ["0.875rem", { lineHeight: "1.25rem", fontWeight: "500" }],
        caption: ["0.75rem", { lineHeight: "1rem", fontWeight: "500" }],
      },
      boxShadow: {
        "elevation-1":
          "0 1px 2px rgba(15,23,42,.06), 0 1px 3px rgba(15,23,42,.08)",
        "elevation-2": "0 8px 24px -4px rgba(15,23,42,.12)",
        "elevation-3": "0 24px 48px -12px rgba(15,23,42,.28)",
      },
      zIndex: {
        sticky: "100",
        fab: "200",
        dropdown: "1000",
        overlay: "1100",
        modal: "1200",
        "popover-in-modal": "1300",
        toast: "1400",
        tooltip: "1500",
      },
      transitionDuration: {
        fast: "120ms",
        base: "200ms",
        slow: "280ms",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(.2,0,0,1)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
