import { Pencil, Trash2, Briefcase, MapPin, DollarSign, Calendar, TrendingUp, CheckCircle, XCircle } from "lucide-react";
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
import { Job } from "@/features/job/schemas/job.schema";
import { Access } from "@/components/access";
import { ALL_PERMISSIONS } from "@/shared/config/permissions";

interface JobTableProps {
  jobs: Job[];
  isLoading?: boolean;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
  currentPage: number;
  pageSize: number;
}

export function JobTable({
  jobs,
  isLoading,
  onEdit,
  onDelete,
  currentPage,
  pageSize,
}: JobTableProps) {
  if (isLoading) {
    return <JobTableSkeleton />;
  }

  return (
    <Access permission={ALL_PERMISSIONS.JOBS.GET_PAGINATE}>
      <TooltipProvider>
        <div className="admin-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">STT</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>IsActive</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-12">
                    <div className="flex flex-col items-center justify-center gap-3 text-gray-500">
                      <Briefcase className="h-12 w-12 text-gray-300" />
                      <div className="text-center">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          No jobs found
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Try adjusting your search or filters
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
interface JobTableRowProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (_id: string) => void;
  orderNumber: number;
}

function JobTableRow({ job, onEdit, onDelete, orderNumber }: JobTableRowProps) {
  // Get level badge color
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
  
  // Format salary
  const formatSalary = (salary: number) => {
    if (salary >= 1000000) {
      return `${(salary / 1000000).toFixed(0)}M`;
    }
    return salary.toLocaleString();
  };
  
  return (
    <TableRow className="admin-table-row group">
      <TableCell className="text-center font-medium text-gray-500">
        {orderNumber}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-gray-400" />
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
          <DollarSign className="h-4 w-4 text-green-500" />
          <Badge variant="secondary" className="font-mono">
            {formatSalary(job.salary)} VND
          </Badge>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-gray-400" />
          <Badge className={getLevelColor()}>
            {job.level}
          </Badge>
        </div>
      </TableCell>
      <TableCell>
        {job.isActive ? (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800">
              Active
            </Badge>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-500" />
            <Badge variant="destructive" className="bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800">
              Inactive
            </Badge>
          </div>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm">
            {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "-"}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Access permission={ALL_PERMISSIONS.JOBS.UPDATE} hideChildren>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(job)}
                  className="h-8 w-8 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit job</p>
              </TooltipContent>
            </Tooltip>
          </Access>
          <Access permission={ALL_PERMISSIONS.JOBS.DELETE} hideChildren>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(job._id)}
                  className="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete job</p>
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
  return (
    <div className="admin-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">STT</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Salary</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>IsActive</TableHead>
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
