"use client";

import { Plus, Trash2, Edit2 } from 'lucide-react';
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import CVFormSection from "@/components/sections/cv-form-section";
import DataModal from "../modals/data-modal";
import { EducationRequestSchema, type EducationRequest } from "@/features/cv-profile/schemas/cv-profile.schema";

interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: Date | string;
  endDate?: Date | string;
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
  
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EducationRequest>({
    resolver: zodResolver(EducationRequestSchema),
    mode: "onChange",
    defaultValues: {
      school: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  });

  const handleOpen = (edu?: Education) => {
    if (edu) {
      reset({
        school: edu.school,
        degree: edu.degree,
        field: edu.field,
        startDate: edu.startDate ? (typeof edu.startDate === "string" ? edu.startDate : edu.startDate.toISOString()) : "",
        endDate: edu.endDate ? (typeof edu.endDate === "string" ? edu.endDate : edu.endDate.toISOString()) : "",
        description: edu.description,
      });
      setEditingId(edu.id);
    } else {
      reset({
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

  const handleSave = handleSubmit((data) => {
    if (editingId) {
      // Update existing
      onUpdate(editingId, "school", data.school);
      onUpdate(editingId, "degree", data.degree);
      onUpdate(editingId, "field", data.field);
      onUpdate(editingId, "startDate", data.startDate);
      onUpdate(editingId, "endDate", data.endDate || "");
      onUpdate(editingId, "description", data.description || "");
    } else {
      // Add new - create unique id
      const newId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      onAdd({
        id: newId,
        school: data.school,
        degree: data.degree,
        field: data.field,
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
                        {typeof edu.startDate === 'string' ? edu.startDate : edu.startDate.toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' })} - {edu.endDate ? (typeof edu.endDate === 'string' ? edu.endDate : edu.endDate.toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' })) : "Present"}
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
          <Controller
            name="school"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  School *
                </label>
                <input
                  type="text"
                  {...field}
                  placeholder="University of Technology"
                  className={`w-full px-3 py-2 text-sm border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    errors.school ? "border-destructive focus:ring-destructive/50" : "border-border"
                  }`}
                />
                {errors.school && (
                  <p className="mt-1 text-xs text-destructive">{errors.school.message}</p>
                )}
              </div>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="degree"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    Degree *
                  </label>
                  <input
                    type="text"
                    {...field}
                    placeholder="Bachelor"
                    className={`w-full px-3 py-2 text-sm border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors.degree ? "border-destructive focus:ring-destructive/50" : "border-border"
                    }`}
                  />
                  {errors.degree && (
                    <p className="mt-1 text-xs text-destructive">{errors.degree.message}</p>
                  )}
                </div>
              )}
            />
            <Controller
              name="field"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    Field of Study *
                  </label>
                  <input
                    type="text"
                    {...field}
                    placeholder="Computer Science"
                    className={`w-full px-3 py-2 text-sm border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors.field ? "border-destructive focus:ring-destructive/50" : "border-border"
                    }`}
                  />
                  {errors.field && (
                    <p className="mt-1 text-xs text-destructive">{errors.field.message}</p>
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
                    End Date
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
                  placeholder="Add any additional details about your education"
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
