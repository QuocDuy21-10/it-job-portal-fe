"use client";

import { Plus, Trash2, Edit2 } from 'lucide-react';
import { useState } from "react";
import { Card } from "@/components/ui/card";
import CVFormSection from "@/components/sections/cv-form-section";
import DataModal from "../modals/data-modal";

interface Award {
  id: string;
  name: string;
  date: string;
  description: string;
}

interface AwardsSectionProps {
  awards: Award[];
  onAdd: (award: Award) => void;
  onUpdate: (id: string, field: string, value: string) => void;
  onRemove: (id: string) => void;
}

export default function AwardsSection({
  awards,
  onAdd,
  onUpdate,
  onRemove,
}: AwardsSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Award>({
    id: "",
    name: "",
    date: "",
    description: "",
  });

  const handleOpen = (award?: Award) => {
    if (award) {
      setFormData(award);
      setEditingId(award.id);
    } else {
      setFormData({
        id: Date.now().toString(),
        name: "",
        date: "",
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
        title="Awards & Recognition"
        description="Highlight your awards and achievements"
        actionButton={
          <button
            onClick={() => handleOpen()}
            className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Award
          </button>
        }
      >
        <div className="space-y-3">
          {awards.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No awards added yet
            </p>
          ) : (
            awards.map((award) => (
              <Card
                key={award.id}
                className="p-4 bg-secondary/50 border border-border hover:border-primary/50 transition"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{award.name}</h3>
                    {award.date && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {award.date}
                      </p>
                    )}
                    {award.description && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {award.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpen(award)}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-card rounded transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRemove(award.id)}
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
        title={editingId ? "Edit Award" : "Add Award"}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        saveLabel={editingId ? "Update" : "Add"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Award Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Employee of the Year"
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Date
            </label>
            <input
              type="month"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
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
              placeholder="Describe the award or achievement"
              rows={3}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>
        </div>
      </DataModal>
    </>
  );
}
