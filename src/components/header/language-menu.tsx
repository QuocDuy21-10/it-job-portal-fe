"use client";

import { Fragment, useEffect, useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
import { LANGUAGES } from "./nav-config";

export function LanguageMenu() {
  const { language, setLanguage } = useI18n();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".language-toggle-container")) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [open]);

  return (
    <div className="relative language-toggle-container">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 h-10 px-3 bg-white dark:bg-transparent hover:bg-secondary/80 dark:hover:bg-secondary/20 rounded-lg transition-all duration-200 text-sm font-semibold text-foreground/80 focus:outline-none"
      >
        <Globe className="h-[18px] w-[18px] text-foreground/70" />
        <span className="uppercase text-[13px] tracking-wide">{language}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-foreground/70 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute right-0 mt-2.5 w-52 bg-card border border-border/80 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {LANGUAGES.map((lang, index) => (
            <Fragment key={lang.code}>
              {index > 0 && <div className="h-px bg-border/60" />}
              <button
                onClick={() => {
                  setLanguage(lang.code);
                  setOpen(false);
                }}
                className={`w-full text-left px-5 py-3.5 text-sm transition-all duration-200 flex items-center justify-between ${
                  language === lang.code
                    ? "bg-primary/5 dark:bg-primary/10 text-primary font-semibold"
                    : "text-foreground/80 hover:bg-muted/50 font-normal"
                }`}
              >
                <span>{lang.label}</span>
                {language === lang.code && (
                  <Check className="h-4 w-4 text-primary" strokeWidth={3} />
                )}
              </button>
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
