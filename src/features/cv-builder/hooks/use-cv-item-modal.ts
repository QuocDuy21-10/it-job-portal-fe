import { useState } from "react";
import { toast } from "sonner";
import { createLocalId } from "@/features/cv-builder/utils/cv-profile-mapper";

interface CvItemToast {
  title: string;
  description: string;
}

export interface CvItemModalOptions<TRequest, TItem> {
  onAdd: (item: TItem) => void;
  onUpdate: (id: string, field: string, value: string) => void;
  /** Fields written back on edit, in the order onUpdate is called. */
  toFieldUpdates: (data: TRequest) => Record<string, string>;
  addToast: (data: TRequest) => CvItemToast;
  editToast: (data: TRequest) => CvItemToast;
}

export interface CvItemModalState<TRequest, TItem> {
  isOpen: boolean;
  mode: "add" | "edit";
  currentItem: TItem | undefined;
  openAddModal: () => void;
  openEditModal: (item: TItem) => void;
  closeModal: () => void;
  handleSubmit: (data: TRequest) => void;
}

export function useCvItemModal<
  TRequest,
  TItem extends TRequest & { id: string },
>({
  onAdd,
  onUpdate,
  toFieldUpdates,
  addToast,
  editToast,
}: CvItemModalOptions<TRequest, TItem>): CvItemModalState<TRequest, TItem> {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [currentItem, setCurrentItem] = useState<TItem | undefined>(undefined);

  const openAddModal = () => {
    setMode("add");
    setCurrentItem(undefined);
    setIsOpen(true);
  };

  const openEditModal = (item: TItem) => {
    setMode("edit");
    setCurrentItem(item);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setCurrentItem(undefined);
  };

  const handleSubmit = (data: TRequest) => {
    if (mode === "add") {
      // TS cannot prove { id } & TRequest is TItem for a generic TItem.
      onAdd({ id: createLocalId(), ...data } as TItem);
      const { title, description } = addToast(data);
      toast.success(title, { description, duration: 2000 });
    } else if (mode === "edit" && currentItem) {
      for (const [field, value] of Object.entries(toFieldUpdates(data))) {
        onUpdate(currentItem.id, field, value);
      }
      const { title, description } = editToast(data);
      toast.success(title, { description, duration: 2000 });
    }
    closeModal();
  };

  return {
    isOpen,
    mode,
    currentItem,
    openAddModal,
    openEditModal,
    closeModal,
    handleSubmit,
  };
}
