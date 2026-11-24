"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/hooks/use-i18n";
import type { AppLocale } from "@/i18n/routing";
import {
  useGetLegalPageQuery,
  useUpdateLegalPageMutation,
} from "../redux/site-content.api";
import type {
  LegalPageInput,
  LegalPageKey,
} from "../schemas/site-content.schema";

const EMPTY_PAGE: LegalPageInput = {
  title: "",
  description: "",
  contentHtml: "",
  isPublished: false,
};

const hasText = (html: string) =>
  html.replace(/<[^>]*>|&nbsp;/g, "").trim().length > 0;

type LegalTabProps = {
  // Runs the action now, or after the user agrees to lose unsaved edits.
  guard: (action: () => void) => void;
  onDirtyChange: (dirty: boolean) => void;
};

export function LegalTab({ guard, onDirtyChange }: LegalTabProps) {
  const { t } = useI18n();
  const [page, setPage] = useState<LegalPageKey>("terms");
  const [locale, setLocale] = useState<AppLocale>("vi");
  const { currentData, data, isFetching, isError, error } =
    useGetLegalPageQuery({
      page,
      locale,
    });
  const [updateLegalPage, { isLoading: isSaving }] =
    useUpdateLegalPageMutation();

  const isMissing = isError && (error as { status?: number })?.status === 404;
  // currentData is undefined while another page loads; data would still be the previous one.
  const loaded = currentData?.data ?? (isFetching ? undefined : data?.data);
  const initial = isMissing ? EMPTY_PAGE : isError ? undefined : loaded;

  const handleSave = async (input: LegalPageInput) => {
    try {
      await updateLegalPage({ page, locale, data: input }).unwrap();
      onDirtyChange(false);
      toast.success(t("adminPages.siteContent.saved"));
    } catch (err: any) {
      toast.error(err?.data?.message || t("adminPages.siteContent.error"));
    }
  };

  return (
    <div className="admin-card space-y-6 p-4">
      <div className="flex flex-wrap gap-4">
        <div className="w-64 space-y-2">
          <Label htmlFor="legal-page">
            {t("adminPages.siteContent.legal.page")}
          </Label>
          <Select
            value={page}
            onValueChange={(value) =>
              guard(() => setPage(value as LegalPageKey))
            }
          >
            <SelectTrigger id="legal-page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="terms">
                {t("adminPages.siteContent.legal.terms")}
              </SelectItem>
              <SelectItem value="privacy">
                {t("adminPages.siteContent.legal.privacy")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-48 space-y-2">
          <Label htmlFor="legal-locale">
            {t("adminPages.siteContent.legal.locale")}
          </Label>
          <Select
            value={locale}
            onValueChange={(value) =>
              guard(() => setLocale(value as AppLocale))
            }
          >
            <SelectTrigger id="legal-locale">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vi">Tiếng Việt</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {initial ? (
        <LegalPageForm
          key={`${page}-${locale}`}
          initial={initial}
          isSaving={isSaving}
          onSave={handleSave}
          onDirtyChange={onDirtyChange}
        />
      ) : isError ? (
        <p role="alert" className="text-sm text-destructive">
          {t("adminPages.siteContent.error")}
        </p>
      ) : (
        <Skeleton className="h-96 w-full" />
      )}
    </div>
  );
}

type LegalPageFormProps = {
  initial: LegalPageInput;
  isSaving: boolean;
  onSave: (input: LegalPageInput) => void;
  onDirtyChange: (dirty: boolean) => void;
};

function LegalPageForm({
  initial,
  isSaving,
  onSave,
  onDirtyChange,
}: LegalPageFormProps) {
  const { t } = useI18n();
  const [form, setForm] = useState<LegalPageInput>({
    title: initial.title,
    description: initial.description,
    contentHtml: initial.contentHtml,
    isPublished: initial.isPublished,
  });

  const update = (patch: Partial<LegalPageInput>) => {
    setForm((previous) => ({ ...previous, ...patch }));
    onDirtyChange(true);
  };

  const submit = () => {
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !hasText(form.contentHtml)
    ) {
      toast.error(t("adminPages.siteContent.legal.required"));
      return;
    }
    onSave(form);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="legal-title">
          {t("adminPages.siteContent.legal.titleLabel")}
        </Label>
        <Input
          id="legal-title"
          maxLength={200}
          value={form.title}
          onChange={(event) => update({ title: event.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="legal-description">
          {t("adminPages.siteContent.legal.descriptionLabel")}
        </Label>
        <Input
          id="legal-description"
          maxLength={300}
          value={form.description}
          onChange={(event) => update({ description: event.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>{t("adminPages.siteContent.legal.contentLabel")}</Label>
        <RichTextEditor
          value={form.contentHtml}
          allowImages={false}
          disabled={isSaving}
          onChange={(contentHtml, _delta, source) => {
            // Quill rewrites loaded HTML on mount; that is not an edit.
            if (source === "user") update({ contentHtml });
          }}
        />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="legal-published"
          checked={form.isPublished}
          onCheckedChange={(checked) =>
            update({ isPublished: checked === true })
          }
        />
        <Label htmlFor="legal-published">
          {t("adminPages.siteContent.legal.published")}
        </Label>
      </div>
      <Button onClick={submit} disabled={isSaving} className="gap-2">
        {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
        {t("adminPages.siteContent.legal.save")}
      </Button>
    </div>
  );
}
