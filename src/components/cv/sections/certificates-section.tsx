"use client";

import { Plus, Trash2, Edit2 } from 'lucide-react';
import { useState } from "react";
import { Card } from "@/components/ui/card";
import CVFormSection from "@/components/sections/cv-form-section";
import DataModal from "../modals/data-modal";

interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
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
  const [formData, setFormData] = useState<Certificate>({
    id: "",
    name: "",
    issuer: "",
    date: "",
  });

  const handleOpen = (cert?: Certificate) => {
    if (cert) {
      setFormData(cert);
      setEditingId(cert.id);
    } else {
      setFormData({
        id: Date.now().toString(),
        name: "",
        issuer: "",
        date: "",
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
                        {cert.date}
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
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Certificate Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="AWS Certified Solution Architect"
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Issuer
            </label>
            <input
              type="text"
              value={formData.issuer}
              onChange={(e) =>
                setFormData({ ...formData, issuer: e.target.value })
              }
              placeholder="Amazon Web Services"
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Date Issued
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
        </div>
      </DataModal>
    </>
  );
}
