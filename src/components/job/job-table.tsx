import { Pencil, Trash2, Briefcase, MapPin, Calendar, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Job } from "@/features/job/schemas/job.schema";
import { Access } from "@/components/access";
import { EAction } from "@/lib/casl/ability";
import { useI18n } from "@/hooks/use-i18n";
import { formatLocaleDate, formatVndCurrency } from "@/lib/utils/locale-formatters";


interface JobTableProps {
  jobs: Job[];
  isLoading?: boolean;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
  onApprove: (job: Job) => void;
  currentPage: number;
  pageSize: number;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleAll: () => void;
  isAllSelected: boolean;
  isIndeterminate: boolean;
}

export function JobTable({
  jobs,
  isLoading,
  onEdit,
  onDelete,
  onApprove,
  currentPage,
  pageSize,
  selectedIds,
  onToggleSelect,
  onToggleAll,
  isAllSelected,
  isIndeterminate,
}: JobTableProps) {
  const { t } = useI18n();

  if (isLoading) {
    return <JobTableSkeleton />;
  }

  return (
    <Access action={EAction.READ} subject="Job">
      <TooltipProvider>
        <div className="admin-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={isIndeterminate ? "indeterminate" : isAllSelected}
                    onCheckedChange={onToggleAll}
                    aria-label={t("adminPages.shared.selectAll")}
                  />
                </TableHead>
                <TableHead className="w-[80px]">{t("adminPages.shared.number")}</TableHead>
                <TableHead>{t("adminPages.jobs.table.name")}</TableHead>
                <TableHead>{t("adminPages.jobs.table.location")}</TableHead>
                <TableHead>{t("adminPages.jobs.table.salary")}</TableHead>
                <TableHead>{t("adminPages.jobs.table.level")}</TableHead>
                <TableHead>{t("adminPages.jobs.table.isActive")}</TableHead>
                <TableHead>{t("adminPages.jobs.table.approval")}</TableHead>
                <TableHead>{t("adminPages.shared.createdAt")}</TableHead>
                <TableHead className="text-right">{t("adminPages.shared.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="py-12">
                    <div className="flex flex-col items-center justify-center gap-3 text-gray-500">
                      <Briefcase className="h-12 w-12 text-gray-300" />
                      <div className="text-center">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {t("adminPages.jobs.table.emptyTitle")}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {t("adminPages.jobs.table.emptyDescription")}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                jobs.map((job, index) => (
                <JobTableRow
                  key={job._id}
                  job={job}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onApprove={onApprove}
                  orderNumber={(currentPage - 1) * pageSize + index + 1}
                  isSelected={selectedIds.has(job._id)}
                  onToggleSelect={onToggleSelect}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  </Access>
);
}

// Tách component row để dễ maintain
interface JobTableRowProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (_id: string) => void;
  onApprove: (job: Job) => void;
  orderNumber: number;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

function JobTableRow({ job, onEdit, onDelete, onApprove, orderNumber, isSelected, onToggleSelect }: JobTableRowProps) {
  const { t, language } = useI18n();

  const getLevelColor = () => {
    const level = job.level?.toLowerCase() || "";
    if (level === "internship") return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
    if (level === "junior") return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
    if (level === "mid") return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
    if (level === "senior") return "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400";
    if (level === "lead") return "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400";
    if (level === "manager") return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
    return "bg-gray-100 text-gray-700";
  };
  
  // Get approval status badge
  const getApprovalBadge = () => {
    const status = job.approvalStatus?.toUpperCase() || "PENDING";
    if (status === "APPROVED")
      return (
        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800">
          {t("adminPages.jobs.table.approved")}
        </Badge>
      );
    if (status === "REJECTED")
      return (
        <Badge className="bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800">
          {t("adminPages.jobs.table.rejected")}
        </Badge>
      );
    return (
      <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800">
        {t("adminPages.jobs.table.pending")}
      </Badge>
    );
  };

  const getLevelLabel = (level?: string) => {
    switch (level?.toLowerCase()) {
      case "internship":
        return t("adminPages.jobs.levels.internship");
      case "junior":
        return t("adminPages.jobs.levels.junior");
      case "mid":
        return t("adminPages.jobs.levels.mid");
      case "senior":
        return t("adminPages.jobs.levels.senior");
      case "lead":
        return t("adminPages.jobs.levels.lead");
      case "manager":
        return t("adminPages.jobs.levels.manager");
      default:
        return level || "-";
    }
  };
  
  return (
    <TableRow className="admin-table-row group" data-state={isSelected ? "selected" : undefined}>
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(job._id)}
          aria-label={t("adminPages.shared.selectItem", { resource: job.name })}
        />
      </TableCell>
      <TableCell className="text-center font-medium text-gray-500">
        {orderNumber}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {job.name}
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{job.location}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-mono">
            {formatVndCurrency(job.salary, language)}
          </Badge>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Badge className={getLevelColor()}>
            {getLevelLabel(job.level)}
          </Badge>
        </div>
      </TableCell>
      <TableCell>
        {job.isActive ? (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800">
              {t("adminPages.shared.active")}
            </Badge>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800">
              {t("adminPages.shared.inactive")}
            </Badge>
          </div>
        )}
      </TableCell>
      <TableCell>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2">
              {getApprovalBadge()}
            </div>
          </TooltipTrigger>
          {job.approvalNote && (
            <TooltipContent className="max-w-xs">
              <p className="text-xs">{job.approvalNote}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm">
            {job.createdAt ? formatLocaleDate(job.createdAt, language) : "-"}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Access action={EAction.APPROVE} subject="Job" hideChildren>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onApprove(job)}
                  className="h-8 w-8 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                  aria-label={t("adminPages.shared.approveOrReject")}
                >
                  <ShieldCheck className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("adminPages.shared.approveOrReject")}</p>
              </TooltipContent>
            </Tooltip>
          </Access>
          <Access action={EAction.UPDATE} subject="Job" hideChildren>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(job)}
                  className="h-8 w-8 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                  aria-label={`${t("adminPages.shared.edit")} ${t("adminPages.resources.job")}`}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{`${t("adminPages.shared.edit")} ${t("adminPages.resources.job")}`}</p>
              </TooltipContent>
            </Tooltip>
          </Access>
          <Access action={EAction.DELETE} subject="Job" hideChildren>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(job._id)}
                  className="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                  aria-label={`${t("adminPages.shared.delete")} ${t("adminPages.resources.job")}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{`${t("adminPages.shared.delete")} ${t("adminPages.resources.job")}`}</p>
              </TooltipContent>
            </Tooltip>
          </Access>
        </div>
      </TableCell>
    </TableRow>
  );
}

// Skeleton loader component
function JobTableSkeleton() {
  const { t } = useI18n();

  return (
    <div className="admin-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]" />
            <TableHead className="w-[80px]">{t("adminPages.shared.number")}</TableHead>
            <TableHead>{t("adminPages.jobs.table.name")}</TableHead>
            <TableHead>{t("adminPages.jobs.table.location")}</TableHead>
            <TableHead>{t("adminPages.jobs.table.salary")}</TableHead>
            <TableHead>{t("adminPages.jobs.table.level")}</TableHead>
            <TableHead>{t("adminPages.jobs.table.isActive")}</TableHead>
            <TableHead>{t("adminPages.jobs.table.approval")}</TableHead>
            <TableHead>{t("adminPages.shared.createdAt")}</TableHead>
            <TableHead className="text-right">{t("adminPages.shared.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>                <Skeleton className="h-4 w-4" />
              </TableCell>
              <TableCell>                <Skeleton className="h-4 w-8 mx-auto" />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
