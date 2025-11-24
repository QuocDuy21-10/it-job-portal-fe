"use client";

import { Plus, Trash2, Edit2 } from 'lucide-react';
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import CVFormSection from "@/components/sections/cv-form-section";
import DataModal from "../modals/data-modal";
import { ProjectRequestSchema, type ProjectRequest } from "@/features/cv-profile/schemas/cv-profile.schema";

interface Project {
  id: string;
  name: string;
  description: string;
  link: string;
}

interface ProjectsSectionProps {
  projects: Project[];
  onAdd: (project: Project) => void;
  onUpdate: (id: string, field: string, value: string) => void;
  onRemove: (id: string) => void;
}

export default function ProjectsSection({
  projects,
  onAdd,
  onUpdate,
  onRemove,
}: ProjectsSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectRequest>({
    resolver: zodResolver(ProjectRequestSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      link: "",
    },
  });

  const handleOpen = (project?: Project) => {
    if (project) {
      reset({
        name: project.name,
        description: project.description,
        link: project.link,
      });
      setEditingId(project.id);
    } else {
      reset({
        name: "",
        description: "",
        link: "",
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSave = handleSubmit((data) => {
    if (editingId) {
      onUpdate(editingId, "name", data.name);
      onUpdate(editingId, "description", data.description || "");
      onUpdate(editingId, "link", data.link || "");
    } else {
      onAdd({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: data.name,
        description: data.description || "",
        link: data.link || "",
      });
    }
    setIsModalOpen(false);
  });

  return (
    <>
      <CVFormSection
        title="Projects"
        description="Showcase your projects"
        actionButton={
          <button
            onClick={() => handleOpen()}
            className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </button>
        }
      >
        <div className="space-y-3">
          {projects.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No projects added yet
            </p>
          ) : (
            projects.map((project) => (
              <Card
                key={project.id}
                className="p-4 bg-secondary/50 border border-border hover:border-primary/50 transition"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {project.description}
                      </p>
                    )}
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline mt-2 block"
                      >
                        {project.link}
                      </a>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpen(project)}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-card rounded transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRemove(project.id)}
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
        title={editingId ? "Edit Project" : "Add Project"}
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
                  Project Name *
                </label>
                <input
                  type="text"
                  {...field}
                  placeholder="My Awesome Project"
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
                  placeholder="Describe your project"
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
          <Controller
            name="link"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Project Link
                </label>
                <input
                  type="url"
                  {...field}
                  value={field.value || ""}
                  placeholder="https://example.com"
                  className={`w-full px-3 py-2 text-sm border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    errors.link ? "border-destructive focus:ring-destructive/50" : "border-border"
                  }`}
                />
                {errors.link && (
                  <p className="mt-1 text-xs text-destructive">{errors.link.message}</p>
                )}
              </div>
            )}
          />
        </div>
      </DataModal>
    </>
  );
}
