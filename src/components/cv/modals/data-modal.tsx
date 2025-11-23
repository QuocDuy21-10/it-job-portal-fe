"use client";

import { X } from 'lucide-react';
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface DataModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  onSave: () => void;
  children: ReactNode;
  saveLabel?: string;
  isLoading?: boolean;
}

export default function DataModal({
  isOpen,
  title,
  description,
  onClose,
  onSave,
  children,
  saveLabel = "Save",
  isLoading = false,
}: DataModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">{children}</div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-secondary border-t border-border p-4 flex gap-3 justify-end">
          <Button
            onClick={onClose}
            variant="outline"
            className="text-foreground border-border hover:bg-secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {saveLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
