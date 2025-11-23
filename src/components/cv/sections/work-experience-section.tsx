"use client";

import { Plus, Trash2, Edit2 } from 'lucide-react';
import { useState } from "react";
import { Card } from "@/components/ui/card";
import CVFormSection from "@/components/sections/cv-form-section";
import DataModal from "../modals/data-modal";

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface WorkExperienceSectionProps {
  experience: Experience[];
  onAdd: (exp: Experience) => void;
  onUpdate: (id: string, field: string, value: string) => void;
  onRemove: (id: string) => void;
}

export default function WorkExperienceSection({
  experience,
  onAdd,
  onUpdate,
  onRemove,
}: WorkExperienceSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Experience>({
    id: "",
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const handleOpen = (exp?: Experience) => {
    if (exp) {
      setFormData(exp);
      setEditingId(exp.id);
    } else {
      setFormData({
        id: Date.now().toString(),
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingId) {
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "id") {
          onUpdate(editingId, key, value as string);
        }
      });
    } else {
      onAdd(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <CVFormSection
        title="Work Experience"
        description="Add your professional experience"
        actionButton={
          <button
            onClick={() => handleOpen()}
            className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Experience
          </button>
        }
      >
        <div className="space-y-3">
          {experience.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No work experience added yet
            </p>
          ) : (
            experience.map((exp) => (
              <Card
                key={exp.id}
                className="p-4 bg-secondary/50 border border-border hover:border-primary/50 transition"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{exp.position}</h3>
                    <p className="text-sm text-primary font-medium">{exp.company}</p>
                    {exp.startDate && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {exp.startDate} - {exp.endDate || "Present"}
                      </p>
                    )}
                    {exp.description && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {exp.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpen(exp)}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-card rounded transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRemove(exp.id)}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-card rounded transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </CVFormSection>

      <DataModal
        isOpen={isModalOpen}
        title={editingId ? "Edit Experience" : "Add Experience"}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        saveLabel={editingId ? "Update" : "Add"}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Company *
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                placeholder="Tech Company Inc."
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Position *
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                placeholder="Senior Developer"
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Start Date
              </label>
              <input
                type="month"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                End Date
              </label>
              <input
                type="month"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                placeholder="Leave empty for current"
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe your responsibilities and achievements"
              rows={3}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>
        </div>
      </DataModal>
    </>
  );
}
