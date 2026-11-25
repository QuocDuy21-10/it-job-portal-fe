import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UpdateResumeFormData,
  type Resume,
} from "@/features/resume/schemas/resume.schema";
import { useI18n } from "@/hooks/use-i18n";
import { formatDateTime } from "@/lib/utils/locale-formatters";
import { API_BASE_URL_IMAGE } from "@/shared/constants/constant";

const STATUSES = ["PENDING", "REVIEWING", "APPROVED", "REJECTED"] as const;

interface ResumeFormProps {
  formId: string;
  resume: Resume;
  onSubmit: (data: UpdateResumeFormData) => Promise<boolean>;
  isLoading?: boolean;
  onDirtyChange?: (isDirty: boolean) => void;
}

export function ResumeForm({
  formId,
  resume,
  onSubmit,
  isLoading,
  onDirtyChange,
}: ResumeFormProps) {
  const { t } = useI18n();
  const form = useForm<UpdateResumeFormData>({
    resolver: zodResolver(UpdateResumeFormData),
    defaultValues: { status: resume.status },
  });
  const { isDirty } = form.formState;
  const histories = resume.histories ?? [];

  useEffect(() => {
    onDirtyChange?.(isDirty);
    return () => onDirtyChange?.(false);
  }, [isDirty, onDirtyChange]);

  const statusLabel = (status: string) =>
    t(`statisticsDashboard.statuses.${status}`);

  return (
    <div className="space-y-6">
      <dl className="space-y-4">
        <div className="space-y-1">
          <dt className="text-muted-foreground">
            {t("adminPages.resumes.form.email")}
          </dt>
          <dd className="break-all font-medium">{resume.email}</dd>
        </div>
        <div className="space-y-1">
          <dt className="text-muted-foreground">
            {t("adminPages.resumes.form.resume")}
          </dt>
          <dd>
            <a
              href={`${API_BASE_URL_IMAGE}/${resume.url}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {t("adminPages.resumes.table.viewResume")}
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </dd>
        </div>
      </dl>

      <Form {...form}>
        <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("adminPages.resumes.form.status")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {statusLabel(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <section className="space-y-3 border-t border-border pt-6">
        <h3 className="text-h4">{t("adminPages.resumes.form.history")}</h3>
        {histories.length === 0 ? (
          <p className="text-muted-foreground">
            {t("adminPages.resumes.form.noHistory")}
          </p>
        ) : (
          <ol className="divide-y divide-border">
            {histories.map((entry, index) => (
              <li key={index} className="py-3">
                <p className="font-medium">{statusLabel(entry.status)}</p>
                <p className="text-muted-foreground">
                  {formatDateTime(entry.updatedAt)} · {entry.updatedBy?.email}
                </p>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
