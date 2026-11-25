"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import parse from "html-react-parser";
import { ChevronDown, ChevronUp, ExternalLink, Loader2 } from "lucide-react";
import { AdminDrawer } from "@/components/admin/admin-drawer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type {
  ApproveJobFormData,
  Job,
} from "@/features/job/schemas/job.schema";
import { useI18n } from "@/hooks/use-i18n";
import { companyHref, jobHref } from "@/i18n/hrefs";
import { Link } from "@/i18n/navigation";
import { sanitizeRichText } from "@/lib/security/sanitize-html";
import {
  formatDateTime,
  formatVndCurrency,
} from "@/lib/utils/locale-formatters";
import { API_BASE_URL_IMAGE } from "@/shared/constants/constant";
import { format } from "date-fns";
import { ApprovalStatusBadge } from "./approval-status-badge";

const MAX_REASON = 500;

interface JobApprovalDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  queue: Job[];
  index: number;
  onNavigate: (index: number) => void;
  onSubmit: (data: ApproveJobFormData) => Promise<boolean>;
  isLoading: boolean;
}

// Mirrors the backend's isJobPubliclyVisible.
const isPublic = (job: Job) =>
  job.approvalStatus === "APPROVED" &&
  job.isActive &&
  (!job.endDate || new Date(job.endDate) >= new Date());

export function JobApprovalDrawer({
  open,
  onOpenChange,
  queue,
  index,
  onNavigate,
  onSubmit,
  isLoading,
}: JobApprovalDrawerProps) {
  const { t, language } = useI18n();
  const [isRejecting, setIsRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const job = queue[index];
  const jobId = job?._id;

  useEffect(() => {
    setIsRejecting(false);
    setReason("");
  }, [jobId, open]);

  if (!job) return null;

  const label = (key: string, values?: Record<string, string | number>) =>
    t(`adminPages.jobs.review.${key}`, values);
  const status = job.approvalStatus ?? "PENDING";
  const hasPrevious = index > 0;
  const hasNext = index < queue.length - 1;

  const handleKeyDown = (event: KeyboardEvent) => {
    const isTyping = (event.target as HTMLElement).closest(
      "input, textarea, select, [contenteditable='true']"
    );
    if (
      isTyping ||
      isRejecting ||
      isLoading ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey
    ) {
      return;
    }
    const key = event.key.toLowerCase();
    if (key === "j" && hasNext) onNavigate(index + 1);
    if (key === "k" && hasPrevious) onNavigate(index - 1);
  };

  const reject = async () => {
    const isSaved = await onSubmit({
      status: "REJECTED",
      approvalNote: reason.trim(),
    });
    if (isSaved) {
      setIsRejecting(false);
      setReason("");
    }
  };

  const facts = [
    [
      t("adminPages.jobs.table.salary"),
      formatVndCurrency(job.salary, language),
    ],
    [
      t("adminPages.jobs.table.level"),
      t(`adminPages.jobs.levels.${job.level?.toLowerCase()}`),
    ],
    [
      t("adminPages.jobs.form.workType"),
      t(`adminPages.jobs.workTypes.${job.formOfWork}`),
    ],
    [
      label("deadline"),
      job.endDate
        ? format(new Date(job.endDate), "dd/MM/yyyy")
        : label("noDeadline"),
    ],
  ];

  return (
    <AdminDrawer
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      title={job.name}
      description={[
        job.company?.name,
        job.location,
        job.createdBy?.email,
        job.createdAt && formatDateTime(job.createdAt),
      ]
        .filter(Boolean)
        .join(" · ")}
      meta={
        <div className="flex flex-wrap items-center gap-2 text-caption text-muted-foreground">
          <ApprovalStatusBadge status={status} />
          {queue.length > 1 && (
            <span aria-live="polite">
              {label("queue", { current: index + 1, total: queue.length })}
            </span>
          )}
        </div>
      }
      headerActions={
        <>
          {isPublic(job) && (
            <Button asChild variant="ghost" className="gap-2">
              <Link
                href={jobHref(job._id, job.name)}
                target="_blank"
                rel="noreferrer"
              >
                <span className="sr-only sm:not-sr-only">
                  {label("openPublic")}
                </span>
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          )}
          {queue.length > 1 && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                title={label("previous")}
                aria-label={label("previous")}
                disabled={!hasPrevious || isLoading}
                onClick={() => onNavigate(index - 1)}
              >
                <ChevronUp className="h-5 w-5" aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                title={label("next")}
                aria-label={label("next")}
                disabled={!hasNext || isLoading}
                onClick={() => onNavigate(index + 1)}
              >
                <ChevronDown className="h-5 w-5" aria-hidden="true" />
              </Button>
            </>
          )}
        </>
      }
      isDirty={!!reason.trim()}
      isBusy={isLoading}
      contentKey={job._id}
      onKeyDown={handleKeyDown}
      footer={
        <>
          {status === "PENDING" && hasNext && (
            <Button
              type="button"
              variant="outline"
              className="h-11 sm:mr-auto md:h-10"
              disabled={isLoading}
              onClick={() => onNavigate(index + 1)}
            >
              {label("skip")}
            </Button>
          )}
          {status !== "REJECTED" && (
            <Button
              type="button"
              variant="outline"
              className="h-11 border-error text-error hover:bg-error-bg hover:text-error md:h-10"
              disabled={isLoading}
              onClick={() => setIsRejecting(true)}
            >
              {label("reject")}
            </Button>
          )}
          {status !== "APPROVED" && (
            <Button
              type="button"
              className="relative h-11 md:h-10"
              disabled={isLoading}
              aria-busy={isLoading}
              onClick={() => onSubmit({ status: "APPROVED" })}
            >
              <span className={isLoading ? "opacity-0" : undefined}>
                {label("approve")}
              </span>
              {isLoading && (
                <Loader2
                  className="absolute h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              )}
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-6">
        {status === "REJECTED" && job.approvalNote && (
          <Alert className="border-error bg-error-bg text-error">
            <AlertTitle>{label("rejectedTitle")}</AlertTitle>
            <AlertDescription>{job.approvalNote}</AlertDescription>
          </Alert>
        )}

        <dl className="grid grid-cols-2 gap-4 rounded-lg border border-border p-4 md:grid-cols-4">
          {facts.map(([term, value]) => (
            <div key={term} className="space-y-1">
              <dt className="text-caption text-muted-foreground">{term}</dt>
              <dd className="font-medium tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>

        <section className="space-y-2">
          <h3 className="text-h4">{label("skills")}</h3>
          <ul className="flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <li key={skill} className="rounded-md bg-muted px-2 py-1">
                {skill}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-2">
          <h3 className="text-h4">{label("description")}</h3>
          <div className="max-w-[68ch] space-y-2 break-words leading-relaxed [&_a]:text-primary [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5">
            {parse(sanitizeRichText(job.description || ""))}
          </div>
        </section>

        {job.company && (
          <div className="flex items-center gap-3 rounded-lg border border-border p-4">
            <Avatar className="h-10 w-10 rounded-md border border-border bg-card">
              {job.company.logo && (
                <AvatarImage
                  src={`${API_BASE_URL_IMAGE}/images/company/${job.company.logo}`}
                  alt={job.company.name}
                  className="object-contain"
                />
              )}
              <AvatarFallback className="rounded-md">
                {job.company.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <p className="min-w-0 flex-1 truncate font-medium">
              {job.company.name}
            </p>
            <Link
              href={companyHref(job.company._id, job.company.name)}
              target="_blank"
              rel="noreferrer"
              className="rounded-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {label("viewCompany")}
            </Link>
          </div>
        )}
      </div>

      <AlertDialog open={isRejecting} onOpenChange={setIsRejecting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {label("rejectTitle", { name: job.name })}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {label("rejectDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reject-reason">{label("reason")}</Label>
            <Textarea
              id="reject-reason"
              rows={4}
              maxLength={MAX_REASON}
              value={reason}
              placeholder={label("reasonPlaceholder")}
              disabled={isLoading}
              onChange={(event) => setReason(event.target.value)}
            />
            <p className="text-right text-caption tabular-nums text-muted-foreground">
              {reason.length}/{MAX_REASON}
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>
              {t("common.cancel")}
            </AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={isLoading || !reason.trim()}
              onClick={reject}
            >
              {label("rejectConfirm")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminDrawer>
  );
}
