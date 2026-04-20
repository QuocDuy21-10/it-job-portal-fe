import { useState, useCallback, useEffect } from "react";

interface SelectableItem {
  _id: string;
}

interface UseTableSelectionReturn {
  selectedIds: Set<string>;
  selectedCount: number;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  isSelected: (id: string) => boolean;
  toggle: (id: string) => void;
  toggleAll: () => void;
  clear: () => void;
}

export function useTableSelection<T extends SelectableItem>(
  items: T[]
): UseTableSelectionReturn {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Auto-clear selection when the items list changes (page/filter change)
  useEffect(() => {
    setSelectedIds(new Set());
  }, [items]);

  const selectedCount = selectedIds.size;
  const isAllSelected = items.length > 0 && selectedCount === items.length;
  const isIndeterminate = selectedCount > 0 && selectedCount < items.length;

  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds]
  );

  const toggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelectedIds((prev) => {
      if (prev.size === items.length) {
        return new Set();
      }
      return new Set(items.map((item) => item._id));
    });
  }, [items]);

  const clear = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  return {
    selectedIds,
    selectedCount,
    isAllSelected,
    isIndeterminate,
    isSelected,
    toggle,
    toggleAll,
    clear,
  };
}
