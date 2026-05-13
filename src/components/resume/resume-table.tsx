import { FileText, ExternalLink, Calendar, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
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
import { Resume } from "@/features/resume/schemas/resume.schema";
import { API_BASE_URL_IMAGE } from "@/shared/constants/constant";
import { Access } from "@/components/access";
import { EAction } from "@/lib/casl/ability";
import { useI18n } from "@/hooks/use-i18n";
import { formatLocaleDate } from "@/lib/utils/locale-formatters";

interface ResumeTableProps {
  resumes: Resume[];
  isLoading?: boolean;
  onEdit: (resume: Resume) => void;
  onDelete: (id: string) => void;
  currentPage: number;
  pageSize: number;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleAll: () => void;
  isAllSelected: boolean;
  isIndeterminate: boolean;
}

export function ResumeTable({
  resumes,
  isLoading,
  onEdit,
  onDelete,
  currentPage,
  pageSize,
  selectedIds,
  onToggleSelect,
  onToggleAll,
  isAllSelected,
  isIndeterminate,
}: ResumeTableProps) {
  const { t } = useI18n();

  if (isLoading) {
    return <ResumeTableSkeleton />;
  }

  return (
    <Access action={EAction.READ} subject="Resume">
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
                <TableHead>{t("adminPages.resumes.table.email")}</TableHead>
                <TableHead>{t("adminPages.resumes.table.link")}</TableHead>
                <TableHead>{t("adminPages.resumes.table.job")}</TableHead>
                <TableHead>{t("adminPages.resumes.table.company")}</TableHead>
                <TableHead>{t("adminPages.resumes.table.priority")}</TableHead>
                <TableHead>{t("adminPages.resumes.table.matchingScore")}</TableHead>
                <TableHead>{t("adminPages.resumes.table.status")}</TableHead>
                <TableHead>{t("adminPages.shared.createdAt")}</TableHead>
                <TableHead className="text-right">{t("adminPages.shared.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resumes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="py-12">
                    <div className="flex flex-col items-center justify-center gap-3 text-gray-500">
                      <FileText className="h-12 w-12 text-gray-300" />
                      <div className="text-center">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {t("adminPages.resumes.table.emptyTitle")}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {t("adminPages.resumes.table.emptyDescription")}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                resumes.map((resume, index) => (
                <ResumeTableRow
                  key={resume._id}
                  resume={resume}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  orderNumber={(currentPage - 1) * pageSize + index + 1}
                  isSelected={selectedIds.has(resume._id as string)}
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
interface ResumeTableRowProps {
  resume: Resume;
  onEdit: (resume: Resume) => void;
  onDelete: (id: string) => void;
  orderNumber: number;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

function ResumeTableRow({ resume, onEdit, onDelete, orderNumber, isSelected, onToggleSelect }: ResumeTableRowProps) {
  const { t, language } = useI18n();

  const getPriorityColor = () => {
    const priority = resume.priority?.toUpperCase() || "";
    if (priority === "EXCELLENT") return "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400";
    if (priority === "HIGH") return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
    if (priority === "MEDIUM") return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400";
    if (priority === "LOW") return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
    return "bg-gray-100 text-gray-700";
  };
  
  // Get status badge color
  const getStatusColor = () => {
    const status = resume.status?.toUpperCase() || "";
    if (status === "APPROVED") return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
    if (status === "REJECTED") return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
    if (status === "REVIEWING") return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
    if (status === "PENDING") return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400";
    return "bg-gray-100 text-gray-700";
  };
  
  // Get score badge color
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
    if (score >= 60) return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
    if (score >= 40) return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400";
    return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
  };
  
  return (
    <TableRow className="admin-table-row group" data-state={isSelected ? "selected" : undefined}>
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(resume._id as string)}
          aria-label={t("adminPages.shared.selectItem", { resource: resume.email })}
        />
      </TableCell>
      <TableCell className="text-center font-medium text-gray-500">
        {orderNumber}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {resume.email}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <a
          href={`${API_BASE_URL_IMAGE}/${resume.url}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          <span className="hover:underline">{t("adminPages.resumes.table.viewResume")}</span>
        </a>
      </TableCell>
      <TableCell>
        {resume.jobId ? (
          typeof resume.jobId === "object" ? (
            <Link
              href={`/jobs/${resume.jobId._id}`}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors"
            >
              {resume.jobId.name}
            </Link>
          ) : (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {resume.jobId}
            </span>
          )
        ) : (
          <span className="text-sm text-gray-500">-</span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <span className="text-sm">
            {resume.companyId
              ? typeof resume.companyId === "object"
                ? resume.companyId.name
                : resume.companyId
              : "-"}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Badge className={getPriorityColor()}>
            {resume.priority
              ? t(`adminPages.resumes.priorities.${resume.priority.toLowerCase()}`)
              : "-"}
          </Badge>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {typeof resume.aiAnalysis?.matchingScore === "number" ? (
            <Badge className={getScoreColor(resume.aiAnalysis.matchingScore)}>
              {resume.aiAnalysis.matchingScore}%
            </Badge>
          ) : (
            <Badge variant="outline">-</Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge className={getStatusColor()}>
          {t(`statisticsDashboard.statuses.${resume.status.toUpperCase()}`)}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm">
            {resume.createdAt ? formatLocaleDate(resume.createdAt, language) : "-"}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Access action={EAction.UPDATE} subject="Resume" hideChildren>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(resume)}
                  className="h-8 w-8 p-0 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400"
                  aria-label={`${t("adminPages.shared.edit")} ${t("adminPages.resources.resume")}`}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{`${t("adminPages.shared.edit")} ${t("adminPages.resources.resume")}`}</p>
              </TooltipContent>
            </Tooltip>
          </Access>
          <Access action={EAction.DELETE} subject="Resume" hideChildren>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(resume._id as string)}
                  className="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                  aria-label={`${t("adminPages.shared.delete")} ${t("adminPages.resources.resume")}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{`${t("adminPages.shared.delete")} ${t("adminPages.resources.resume")}`}</p>
              </TooltipContent>
            </Tooltip>
          </Access>
        </div>
      </TableCell>
    </TableRow>
  );
}

// Skeleton loader component
function ResumeTableSkeleton() {
  const { t } = useI18n();

  return (
    <div className="admin-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]" />
            <TableHead className="w-[80px]">{t("adminPages.shared.number")}</TableHead>
            <TableHead>{t("adminPages.resumes.table.email")}</TableHead>
            <TableHead>{t("adminPages.resumes.table.link")}</TableHead>
            <TableHead>{t("adminPages.resumes.table.job")}</TableHead>
            <TableHead>{t("adminPages.resumes.table.company")}</TableHead>
            <TableHead>{t("adminPages.resumes.table.priority")}</TableHead>
            <TableHead>{t("adminPages.resumes.table.matchingScore")}</TableHead>
            <TableHead>{t("adminPages.resumes.table.status")}</TableHead>
            <TableHead>{t("adminPages.shared.createdAt")}</TableHead>
            <TableHead className="text-right">{t("adminPages.shared.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-4 w-4" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-8 mx-auto" />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <div className="flex justify-end">
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
