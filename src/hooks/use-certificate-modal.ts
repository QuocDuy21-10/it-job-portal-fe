import { useState } from "react";
import { toast } from "sonner";
import { CertificateRequest } from "@/features/cv-profile/schemas/cv-profile.schema";

interface Certificate extends CertificateRequest {
  id: string;
}

interface UseCertificateModalReturn {
  isOpen: boolean;
  mode: "add" | "edit";
  currentCertificate: (Certificate & { id?: string }) | undefined;
  openAddModal: () => void;
  openEditModal: (certificate: Certificate) => void;
  closeModal: () => void;
  handleSubmit: (data: CertificateRequest) => void;
}

export function useCertificateModal(
  certificates: Certificate[],
  onAdd: (certificate: Certificate) => void,
  onUpdate: (id: string, field: string, value: string) => void
): UseCertificateModalReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [currentCertificate, setCurrentCertificate] = useState<Certificate | undefined>(undefined);

  const openAddModal = () => {
    setMode("add");
    setCurrentCertificate(undefined);
    setIsOpen(true);
  };

  const openEditModal = (certificate: Certificate) => {
    setMode("edit");
    setCurrentCertificate(certificate);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setCurrentCertificate(undefined);
  };

  const handleSubmit = (data: CertificateRequest) => {
    if (mode === "add") {
      const newCertificate: Certificate = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...data,
      };
      onAdd(newCertificate);
      toast.success("Thêm chứng chỉ thành công", {
        description: `Đã thêm: ${data.name}`,
        duration: 2000,
      });
    } else if (mode === "edit" && currentCertificate) {
      onUpdate(currentCertificate.id, "name", data.name);
      onUpdate(currentCertificate.id, "issuer", data.issuer);
      onUpdate(currentCertificate.id, "date", data.date);
      toast.success("Cập nhật chứng chỉ thành công", {
        description: `Đã cập nhật: ${data.name}`,
        duration: 2000,
      });
    }
    closeModal();
  };

  return {
    isOpen,
    mode,
    currentCertificate,
    openAddModal,
    openEditModal,
    closeModal,
    handleSubmit,
  };
}
