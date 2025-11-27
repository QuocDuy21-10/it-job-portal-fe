import { Pencil, Trash2, Building2, MapPin, Globe, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { ALL_PERMISSIONS } from "@/shared/config/permissions";

interface CompanyTableProps {
  companies: Company[];
  isLoading?: boolean;
  onEdit: (company: Company) => void;
  onDelete: (id: string) => void;
  currentPage: number;
  pageSize: number;
}

export function CompanyTable({
  companies,
  isLoading,
  onEdit,
  onDelete,
  currentPage,
  pageSize,
}: CompanyTableProps) {
  if (isLoading) {
    return <CompanyTableSkeleton />;
  }

  return (
    <Access permission={ALL_PERMISSIONS.COMPANIES.GET_PAGINATE}>
      <TooltipProvider>
        <div className="admin-card">
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">STT</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Number of Employees</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12">
                  <div className="flex flex-col items-center justify-center gap-3 text-gray-500">
                    <Building2 className="h-12 w-12 text-gray-300" />
                    <div className="text-center">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        No companies found
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Try adjusting your search or filters
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
  orderNumber: number; // Add this prop
}

function CompanyTableRow({
  company,
  onEdit,
  onDelete,
  orderNumber,
}: CompanyTableRowProps) {
  // Get first letter for avatar
  
  return (
    <TableRow className="admin-table-row group">
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
              Visit
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
            {new Date(company.createdAt || "").toLocaleDateString()}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Access permission={ALL_PERMISSIONS.COMPANIES.UPDATE} hideChildren>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(company)}
                  className="h-8 w-8 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit company</p>
              </TooltipContent>
            </Tooltip>
          </Access>
          <Access permission={ALL_PERMISSIONS.COMPANIES.DELETE} hideChildren>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(company._id as string)}
                  className="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete company</p>
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
  return (
    <div className="admin-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">STT</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Website</TableHead>
            <TableHead>Number of Employees</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
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
