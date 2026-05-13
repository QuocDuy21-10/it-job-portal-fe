import { Pencil, Trash2, Building2, MapPin, Globe, Calendar, Users } from "lucide-react";
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
import { Company } from "@/features/company/schemas/company.schema";
import { Access } from "@/components/access";
import { EAction } from "@/lib/casl/ability";
import { useI18n } from "@/hooks/use-i18n";
import { formatLocaleDate } from "@/lib/utils/locale-formatters";

interface CompanyTableProps {
  companies: Company[];
  isLoading?: boolean;
  onEdit: (company: Company) => void;
  onDelete: (id: string) => void;
  currentPage: number;
  pageSize: number;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleAll: () => void;
  isAllSelected: boolean;
  isIndeterminate: boolean;
}

export function   CompanyTable({
  companies,
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
}: CompanyTableProps) {
  const { t } = useI18n();

  if (isLoading) {
    return <CompanyTableSkeleton />;
  }

  return (
    <Access action={EAction.READ} subject="Company">
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
              <TableHead>{t("adminPages.companies.table.name")}</TableHead>
              <TableHead>{t("adminPages.companies.table.address")}</TableHead>
              <TableHead>{t("adminPages.companies.table.website")}</TableHead>
              <TableHead>{t("adminPages.companies.table.employees")}</TableHead>
              <TableHead>{t("adminPages.shared.createdAt")}</TableHead>
              <TableHead className="text-right">{t("adminPages.shared.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-12">
                  <div className="flex flex-col items-center justify-center gap-3 text-gray-500">
                    <Building2 className="h-12 w-12 text-gray-300" />
                    <div className="text-center">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {t("adminPages.companies.table.emptyTitle")}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {t("adminPages.companies.table.emptyDescription")}
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              companies.map((company, index) => (
                <CompanyTableRow
                  key={company._id}
                  company={company}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  orderNumber={(currentPage - 1) * pageSize + index + 1}
                  isSelected={selectedIds.has(company._id as string)}
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
interface CompanyTableRowProps {
  company: Company;
  onEdit: (company: Company) => void;
  onDelete: (_id: string) => void;
  orderNumber: number;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

function CompanyTableRow({
  company,
  onEdit,
  onDelete,
  orderNumber,
  isSelected,
  onToggleSelect,
}: CompanyTableRowProps) {
  const { t, language } = useI18n();
  
  return (
    <TableRow className="admin-table-row group" data-state={isSelected ? "selected" : undefined}>
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(company._id as string)}
          aria-label={t("adminPages.shared.selectItem", { resource: company.name })}
        />
      </TableCell>
      <TableCell className="text-center font-medium text-gray-500">
        {orderNumber}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          {/* Company Avatar */}
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {company.name}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{company.address || "-"}</span>
        </div>
      </TableCell>
      <TableCell>
        {company.website ? (
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-gray-400" />
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors"
            >
              {t("adminPages.companies.table.visit")}
            </a>
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </TableCell>
      <TableCell>
        {company.numberOfEmployees ? (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-400" />
            <Badge variant="secondary" className="font-normal">
              {company.numberOfEmployees}
            </Badge>
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm">
            {company.createdAt ? formatLocaleDate(company.createdAt, language) : "-"}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Access action={EAction.UPDATE} subject="Company" hideChildren>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(company)}
                  className="h-8 w-8 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                  aria-label={`${t("adminPages.shared.edit")} ${t("adminPages.resources.company")}`}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{`${t("adminPages.shared.edit")} ${t("adminPages.resources.company")}`}</p>
              </TooltipContent>
            </Tooltip>
          </Access>
          <Access action={EAction.DELETE} subject="Company" hideChildren>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(company._id as string)}
                  className="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                  aria-label={`${t("adminPages.shared.delete")} ${t("adminPages.resources.company")}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{`${t("adminPages.shared.delete")} ${t("adminPages.resources.company")}`}</p>
              </TooltipContent>
            </Tooltip>
          </Access>
        </div>
      </TableCell>
    </TableRow>
  );
}

// Skeleton loader component
function CompanyTableSkeleton() {
  const { t } = useI18n();

  return (
    <div className="admin-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]" />
            <TableHead className="w-[80px]">{t("adminPages.shared.number")}</TableHead>
            <TableHead>{t("adminPages.companies.table.name")}</TableHead>
            <TableHead>{t("adminPages.companies.table.address")}</TableHead>
            <TableHead>{t("adminPages.companies.table.website")}</TableHead>
            <TableHead>{t("adminPages.companies.table.employees")}</TableHead>
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
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-40" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
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
