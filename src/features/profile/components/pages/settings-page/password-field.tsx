"use client";

import { useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";

interface PasswordFieldProps {
  label: string;
  placeholder: string;
  autoComplete: string;
  disabled: boolean;
  registration: UseFormRegisterReturn;
  error?: string;
}

export function PasswordField({
  label,
  placeholder,
  autoComplete,
  disabled,
  registration,
  error,
}: PasswordFieldProps) {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          {...registration}
          className="w-full px-3 py-2.5 pr-10 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          autoComplete={autoComplete}
          disabled={disabled}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setVisible((s) => !s)}
          className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-500 hover:text-gray-700"
          aria-pressed={visible}
          aria-label={
            visible
              ? t("settingsPage.hidePassword")
              : t("settingsPage.showPassword")
          }
        >
          {visible ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>
      {error && (
        <p className="text-sm text-destructive mt-1.5 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}
