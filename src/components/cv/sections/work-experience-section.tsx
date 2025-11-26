"use client";

import { Plus, Trash2, Edit2 } from 'lucide-react';
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import CVFormSection from "@/components/sections/cv-form-section";
import DataModal from "../modals/data-modal";
import { ExperienceRequestSchema, type ExperienceRequest } from "@/features/cv-profile/schemas/cv-profile.schema";

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: Date | string;
  endDate: Date | string;
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

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExperienceRequest>({
    resolver: zodResolver(ExperienceRequestSchema),
    mode: "onChange",
    defaultValues: {
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  });

  const handleOpen = (exp?: Experience) => {
    if (exp) {
      reset({
        company: exp.company,
        position: exp.position,
        startDate: exp.startDate ? (typeof exp.startDate === "string" ? exp.startDate : exp.startDate.toISOString()) : "",
        endDate: exp.endDate ? (typeof exp.endDate === "string" ? exp.endDate : exp.endDate.toISOString()) : "",
        description: exp.description,
      });
      setEditingId(exp.id);
    } else {
      reset({
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

  const handleSave = handleSubmit((data) => {
    if (editingId) {
      onUpdate(editingId, "company", data.company);
      onUpdate(editingId, "position", data.position);
      onUpdate(editingId, "startDate", data.startDate);
      onUpdate(editingId, "endDate", data.endDate || "");
      onUpdate(editingId, "description", data.description || "");
    } else {
      // Add new - create unique id
      const newId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      onAdd({
        id: newId,
        company: data.company,
        position: data.position,
        startDate: data.startDate,
        endDate: data.endDate || "",
        description: data.description || "",
      });
    }
    setIsModalOpen(false);
  });

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
                        {typeof exp.startDate === 'string' ? exp.startDate : exp.startDate.toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' })} - {exp.endDate ? (typeof exp.endDate === 'string' ? exp.endDate : exp.endDate.toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' })) : "Present"}
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
            <Controller
              name="company"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    Company *
                  </label>
                  <input
                    type="text"
                    {...field}
                    placeholder="Tech Company Inc."
                    className={`w-full px-3 py-2 text-sm border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors.company ? "border-destructive focus:ring-destructive/50" : "border-border"
                    }`}
                  />
                  {errors.company && (
                    <p className="mt-1 text-xs text-destructive">{errors.company.message}</p>
                  )}
                </div>
              )}
            />
            <Controller
              name="position"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    Position *
                  </label>
                  <input
                    type="text"
                    {...field}
                    placeholder="Senior Developer"
                    className={`w-full px-3 py-2 text-sm border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors.position ? "border-destructive focus:ring-destructive/50" : "border-border"
                    }`}
                  />
                  {errors.position && (
                    <p className="mt-1 text-xs text-destructive">{errors.position.message}</p>
                  )}
                </div>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    Start Date *
                  </label>
                  <input
                    type="month"
                    value={field.value ? new Date(field.value).toISOString().slice(0, 7) : ""}
                    onChange={(e) => {
                      const dateValue = e.target.value ? new Date(e.target.value + "-01").toISOString() : "";
                      field.onChange(dateValue);
                    }}
                    className={`w-full px-3 py-2 text-sm border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors.startDate ? "border-destructive focus:ring-destructive/50" : "border-border"
                    }`}
                  />
                  {errors.startDate && (
                    <p className="mt-1 text-xs text-destructive">{errors.startDate.message}</p>
                  )}
                </div>
              )}
            />
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    End Date *
                  </label>
                  <input
                    type="month"
                    value={field.value ? new Date(field.value).toISOString().slice(0, 7) : ""}
                    onChange={(e) => {
                      const dateValue = e.target.value ? new Date(e.target.value + "-01").toISOString() : "";
                      field.onChange(dateValue);
                    }}
                    placeholder="Leave empty for current"
                    className={`w-full px-3 py-2 text-sm border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors.endDate ? "border-destructive focus:ring-destructive/50" : "border-border"
                    }`}
                  />
                  {errors.endDate && (
                    <p className="mt-1 text-xs text-destructive">{errors.endDate.message}</p>
                  )}
                </div>
              )}
            />
          </div>
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
                  placeholder="Describe your responsibilities and achievements"
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
