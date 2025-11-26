"use client";

import { Plus, Trash2, Edit2 } from 'lucide-react';
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import CVFormSection from "@/components/sections/cv-form-section";
import DataModal from "../modals/data-modal";
import { AwardRequestSchema, type AwardRequest } from "@/features/cv-profile/schemas/cv-profile.schema";

interface Award {
  id: string;
  name: string;
  date: Date | string;
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

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AwardRequest>({
    resolver: zodResolver(AwardRequestSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      date: "",
      description: "",
    },
  });

  const handleOpen = (award?: Award) => {
    if (award) {
      reset({
        name: award.name,
        date: award.date ? (typeof award.date === "string" ? award.date : award.date.toISOString().slice(0, 7)) : "",
        description: award.description,
      });
      setEditingId(award.id);
    } else {
      reset({
        name: "",
        date: "",
        description: "",
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSave = handleSubmit((data) => {
    if (editingId) {
      onUpdate(editingId, "name", data.name);
      onUpdate(editingId, "date", data.date);
      onUpdate(editingId, "description", data.description || "");
    } else {
      // Add new - create unique id
      const newId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      onAdd({
        id: newId,
        name: data.name,
        date: data.date,
        description: data.description || "",
      });
    }
    setIsModalOpen(false);
  });

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
                        {typeof award.date === 'string' ? award.date : award.date.toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' })}
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
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Award Name *
                </label>
                <input
                  type="text"
                  {...field}
                  placeholder="Employee of the Year"
                  className={`w-full px-3 py-2 text-sm border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    errors.name ? "border-destructive focus:ring-destructive/50" : "border-border"
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>
            )}
          />
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Date *
                </label>
                <input
                  type="month"
                  value={field.value ? new Date(field.value).toISOString().slice(0, 7) : ""}
                  onChange={(e) => {
                    const dateValue = e.target.value ? new Date(e.target.value + "-01").toISOString() : "";
                    field.onChange(dateValue);
                  }}
                  className={`w-full px-3 py-2 text-sm border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    errors.date ? "border-destructive focus:ring-destructive/50" : "border-border"
                  }`}
                />
                {errors.date && (
                  <p className="mt-1 text-xs text-destructive">{errors.date.message}</p>
                )}
              </div>
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Description
                </label>
                <textarea
                  {...field}
                  value={field.value || ""}
                  placeholder="Describe the award or achievement"
                  rows={3}
                  className={`w-full px-3 py-2 text-sm border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none ${
                    errors.description ? "border-destructive focus:ring-destructive/50" : "border-border"
                  }`}
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-destructive">{errors.description.message}</p>
                )}
              </div>
            )}
          />
        </div>
      </DataModal>
    </>
  );
}
