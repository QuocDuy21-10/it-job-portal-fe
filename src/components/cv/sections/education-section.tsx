"use client";

import { Plus, Trash2, Edit2 } from 'lucide-react';
import { useState } from "react";
import { Card } from "@/components/ui/card";
import CVFormSection from "@/components/sections/cv-form-section";
import DataModal from "../modals/data-modal";

interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface EducationSectionProps {
  education: Education[];
  onAdd: (edu: Education) => void;
  onUpdate: (id: string, field: string, value: string) => void;
  onRemove: (id: string) => void;
}

export default function EducationSection({
  education,
  onAdd,
  onUpdate,
  onRemove,
}: EducationSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Education>({
    id: "",
    school: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const handleOpen = (edu?: Education) => {
    if (edu) {
      setFormData(edu);
      setEditingId(edu.id);
    } else {
      setFormData({
        id: Date.now().toString(),
        school: "",
        degree: "",
        field: "",
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
      // Update existing
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "id") {
          onUpdate(editingId, key, value as string);
        }
      });
    } else {
      // Add new
      onAdd(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <CVFormSection
        title="Education"
        description="Add your educational background"
        actionButton={
          <button
            onClick={() => handleOpen()}
            className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Education
          </button>
        }
      >
        <div className="space-y-3">
          {education.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No education added yet
            </p>
          ) : (
            education.map((edu) => (
              <Card
                key={edu.id}
                className="p-4 bg-secondary/50 border border-border hover:border-primary/50 transition"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{edu.school}</h3>
                    <p className="text-sm text-primary font-medium">
                      {edu.degree} in {edu.field}
                    </p>
                    {edu.startDate && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {edu.startDate} - {edu.endDate || "Present"}
                      </p>
                    )}
                    {edu.description && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {edu.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpen(edu)}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-card rounded transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRemove(edu.id)}
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
        title={editingId ? "Edit Education" : "Add Education"}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        saveLabel={editingId ? "Update" : "Add"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              School *
            </label>
            <input
              type="text"
              value={formData.school}
              onChange={(e) =>
                setFormData({ ...formData, school: e.target.value })
              }
              placeholder="University of Technology"
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Degree
              </label>
              <input
                type="text"
                value={formData.degree}
                onChange={(e) =>
                  setFormData({ ...formData, degree: e.target.value })
                }
                placeholder="Bachelor"
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Field of Study
              </label>
              <input
                type="text"
                value={formData.field}
                onChange={(e) =>
                  setFormData({ ...formData, field: e.target.value })
                }
                placeholder="Computer Science"
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
              placeholder="Add any additional details about your education"
              rows={3}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>
        </div>
      </DataModal>
    </>
  );
}
