"use client";

import { Plus, Trash2, Edit2 } from 'lucide-react';
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import CVFormSection from "@/components/sections/cv-form-section";
import DataModal from "../modals/data-modal";
import { CertificateRequestSchema, type CertificateRequest } from "@/features/cv-profile/schemas/cv-profile.schema";

interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: Date | string;
}

interface CertificatesSectionProps {
  certificates: Certificate[];
  onAdd: (cert: Certificate) => void;
  onUpdate: (id: string, field: string, value: string) => void;
  onRemove: (id: string) => void;
}

export default function CertificatesSection({
  certificates,
  onAdd,
  onUpdate,
  onRemove,
}: CertificatesSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CertificateRequest>({
    resolver: zodResolver(CertificateRequestSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      issuer: "",
      date: "",
    },
  });

  const handleOpen = (cert?: Certificate) => {
    if (cert) {
      reset({
        name: cert.name,
        issuer: cert.issuer,
        date: cert.date ? (typeof cert.date === "string" ? cert.date : cert.date.toISOString().slice(0, 7)) : "",
      });
      setEditingId(cert.id);
    } else {
      reset({
        name: "",
        issuer: "",
        date: "",
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSave = handleSubmit((data) => {
    if (editingId) {
      onUpdate(editingId, "name", data.name);
      onUpdate(editingId, "issuer", data.issuer);
      onUpdate(editingId, "date", data.date);
    } else {
      onAdd({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: data.name,
        issuer: data.issuer,
        date: data.date,
      });
    }
    setIsModalOpen(false);
  });

  return (
    <>
      <CVFormSection
        title="Certificates & Credentials"
        description="Add your certificates and credentials"
        actionButton={
          <button
            onClick={() => handleOpen()}
            className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Certificate
          </button>
        }
      >
        <div className="space-y-3">
          {certificates.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No certificates added yet
            </p>
          ) : (
            certificates.map((cert) => (
              <Card
                key={cert.id}
                className="p-4 bg-secondary/50 border border-border hover:border-primary/50 transition"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{cert.name}</h3>
                    <p className="text-sm text-primary font-medium mt-1">
                      {cert.issuer}
                    </p>
                    {cert.date && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {typeof cert.date === 'string' ? cert.date : cert.date.toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpen(cert)}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-card rounded transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRemove(cert.id)}
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
        title={editingId ? "Edit Certificate" : "Add Certificate"}
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
                  Certificate Name *
                </label>
                <input
                  type="text"
                  {...field}
                  placeholder="AWS Certified Solution Architect"
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
            name="issuer"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Issuer *
                </label>
                <input
                  type="text"
                  {...field}
                  placeholder="Amazon Web Services"
                  className={`w-full px-3 py-2 text-sm border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    errors.issuer ? "border-destructive focus:ring-destructive/50" : "border-border"
                  }`}
                />
                {errors.issuer && (
                  <p className="mt-1 text-xs text-destructive">{errors.issuer.message}</p>
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
                  Date Issued *
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
        </div>
      </DataModal>
    </>
  );
}
