import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/hooks/use-i18n";

const STATUS = {
  APPROVED: {
    key: "approved",
    icon: CheckCircle2,
    className: "bg-success-bg text-success",
  },
  REJECTED: {
    key: "rejected",
    icon: XCircle,
    className: "bg-error-bg text-error",
  },
  PENDING: {
    key: "pending",
    icon: Clock,
    className: "bg-warning-bg text-warning",
  },
};

export function ApprovalStatusBadge({ status }: { status?: string }) {
  const { t } = useI18n();
  const {
    key,
    icon: Icon,
    className,
  } = STATUS[status?.toUpperCase() as keyof typeof STATUS] ?? STATUS.PENDING;

  return (
    <Badge
      variant="outline"
      className={`gap-1 rounded-md border-transparent font-medium ${className}`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {t(`adminPages.jobs.table.${key}`)}
    </Badge>
  );
}
