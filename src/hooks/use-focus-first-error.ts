import { useEffect } from "react";

// RHF focuses in registration order and skips controls without a ref; this follows the DOM.
export function useFocusFirstError(submitCount: number, formId: string) {
  useEffect(() => {
    if (!submitCount) return;
    const invalid = document
      .getElementById(formId)
      ?.querySelector<HTMLElement>('[aria-invalid="true"]');
    const editor = invalid?.querySelector<HTMLElement>(
      '[contenteditable="true"]'
    );
    (editor ?? invalid)?.focus();
  }, [submitCount, formId]);
}
