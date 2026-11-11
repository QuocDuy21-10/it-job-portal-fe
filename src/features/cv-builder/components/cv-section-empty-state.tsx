import React from "react";
import { Plus } from "lucide-react";

interface CVSectionEmptyStateProps {
  title: string;
  description: string;
  onAdd: () => void;
  icon?: React.ReactNode;
}

/**
 * Empty State Component for CV Sections
 * Hiển thị khi section chưa có data
 */
export default function CVSectionEmptyState({
  title,
  description,
  onAdd,
  icon,
}: CVSectionEmptyStateProps) {
  return (
    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-secondary/20">
      <div className="flex justify-center mb-3">
        {icon || <Plus className="w-8 h-8 text-muted-foreground" />}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium transition"
      >
        <Plus className="w-4 h-4" />
        Thêm {title}
      </button>
    </div>
  );
}
