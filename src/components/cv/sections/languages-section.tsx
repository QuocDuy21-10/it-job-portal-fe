"use client";

import { Plus, X } from 'lucide-react';
import { useState } from "react";
import { Card } from "@/components/ui/card";
import CVFormSection from "@/components/sections/cv-form-section";
import { LanguageRequestSchema, type LanguageRequest } from "@/features/cv-profile/schemas/cv-profile.schema";
import { toast } from "sonner";

interface Language {
  id: string;
  name: string;
  proficiency: string;
}

interface LanguagesSectionProps {
  languages: Language[];
  onAdd: (language: Language) => void;
  onUpdate: (id: string, field: string, value: string) => void;
  onRemove: (id: string) => void;
}

const PROFICIENCY_LEVELS = ["Beginner", "Intermediate", "Advanced", "Native"];

export default function LanguagesSection({
  languages,
  onAdd,
  onUpdate,
  onRemove,
}: LanguagesSectionProps) {
  const [errors, setErrors] = useState<Record<string, { name?: string; proficiency?: string }>>({});

  const handleAddLanguage = () => {
    if (languages.length >= 5) {
      toast.error("Bạn chỉ có thể thêm tối đa 5 ngôn ngữ");
      return;
    }
    onAdd({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: "",
      proficiency: "Intermediate",
    });
  };

  const handleUpdate = (id: string, field: "name" | "proficiency", value: string) => {
    onUpdate(id, field, value);
    
    const lang = languages.find((l) => l.id === id);
    if (lang) {
      const updatedLang = { ...lang, [field]: value };
      const result = LanguageRequestSchema.safeParse({
        name: updatedLang.name,
        proficiency: updatedLang.proficiency,
      });
      
      if (!result.success) {
        const fieldErrors: { name?: string; proficiency?: string } = {};
        result.error.issues.forEach((issue) => {
          if (issue.path[0] === "name" || issue.path[0] === "proficiency") {
            fieldErrors[issue.path[0]] = issue.message;
          }
        });
        setErrors((prev) => ({ ...prev, [id]: fieldErrors }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[id];
          return newErrors;
        });
      }
    }
  };

  return (
    <CVFormSection
      title="Languages"
      description={`Add languages you speak (${languages.length}/5)`}
      actionButton={
        languages.length < 5 && (
          <button
            onClick={handleAddLanguage}
            className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Language
          </button>
        )
      }
    >
      {languages.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">
          No languages added yet
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {languages.map((lang) => (
            <Card key={lang.id} className="p-4 bg-secondary/50 border border-border">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium mb-2 text-muted-foreground">
                    Language *
                  </label>
                  <input
                    type="text"
                    value={lang.name}
                    onChange={(e) => handleUpdate(lang.id, "name", e.target.value)}
                    placeholder="e.g., English, French"
                    className={`w-full px-3 py-2 text-sm border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors[lang.id]?.name ? "border-destructive focus:ring-destructive/50" : "border-border"
                    }`}
                  />
                  {errors[lang.id]?.name && (
                    <p className="mt-1 text-xs text-destructive">{errors[lang.id].name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium mb-2 text-muted-foreground">
                    Proficiency *
                  </label>
                  <select
                    value={lang.proficiency}
                    onChange={(e) => handleUpdate(lang.id, "proficiency", e.target.value)}
                    className={`w-full px-3 py-2 text-sm border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors[lang.id]?.proficiency ? "border-destructive focus:ring-destructive/50" : "border-border"
                    }`}
                  >
                    {PROFICIENCY_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                  {errors[lang.id]?.proficiency && (
                    <p className="mt-1 text-xs text-destructive">{errors[lang.id].proficiency}</p>
                  )}
                </div>
                <button
                  onClick={() => onRemove(lang.id)}
                  className="w-full flex items-center justify-center gap-2 text-destructive hover:text-destructive/80 font-medium text-sm py-2 rounded hover:bg-card transition"
                >
                  <X className="w-4 h-4" />
                  Remove
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </CVFormSection>
  );
}
