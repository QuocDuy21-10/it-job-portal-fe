import { Download, Loader2, Save } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";

interface MobileSaveBarProps {
  onSave: () => void;
  isSaving: boolean;
  canPreview: boolean;
  onPreview: () => void;
}

export default function MobileSaveBar({
  onSave,
  isSaving,
  canPreview,
  onPreview,
}: MobileSaveBarProps) {
  const { t } = useI18n();
  return (
    <div className="lg:hidden fixed bottom-16 left-0 right-0 bg-white dark:bg-card border-t border-gray-200 dark:border-border p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-40 flex flex-col gap-2">
      <button
        onClick={onSave}
        disabled={isSaving}
        className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-3 rounded-lg text-sm transition-transform active:scale-[0.98] flex justify-center items-center gap-2"
      >
        {isSaving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        {t("cvPage.saveCv")}
      </button>
      <button
        onClick={onPreview}
        disabled={!canPreview}
        className="w-full border border-gray-200 dark:border-border text-gray-700 dark:text-gray-300 py-3 rounded-lg font-bold text-sm flex justify-center items-center gap-2 active:bg-secondary/20 transition-colors disabled:opacity-50"
      >
        <Download className="w-4 h-4" />
        {t("cvPage.previewAndDownload")}
      </button>
    </div>
  );
}
