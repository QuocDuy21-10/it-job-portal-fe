"use client";

import { Plus, X } from 'lucide-react';
import { Card } from "@/components/ui/card";
import CVFormSection from "@/components/sections/cv-form-section";

interface Skill {
  id: string;
  name: string;
  level: string;
}

interface SkillsSectionProps {
  skills: Skill[];
  onAdd: (skill: Skill) => void;
  onUpdate: (id: string, field: string, value: string) => void;
  onRemove: (id: string) => void;
}

const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];

export default function SkillsSection({
  skills,
  onAdd,
  onUpdate,
  onRemove,
}: SkillsSectionProps) {
  const handleAddSkill = () => {
    onAdd({
      id: Date.now().toString(),
      name: "",
      level: "Intermediate",
    });
  };

  return (
    <CVFormSection
      title="Skills"
      description={`Add your professional skills (${skills.length}/20)`}
      actionButton={
        skills.length < 20 && (
          <button
            onClick={handleAddSkill}
            className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Skill
          </button>
        )
      }
    >
      {skills.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">
          No skills added yet
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {skills.map((skill) => (
            <Card key={skill.id} className="p-4 bg-secondary/50 border border-border">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium mb-2 text-muted-foreground">
                    Skill Name
                  </label>
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) =>
                      onUpdate(skill.id, "name", e.target.value)
                    }
                    placeholder="e.g., React, Python"
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-2 text-muted-foreground">
                    Level
                  </label>
                  <select
                    value={skill.level}
                    onChange={(e) =>
                      onUpdate(skill.id, "level", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {SKILL_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => onRemove(skill.id)}
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
