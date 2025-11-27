import { Pencil, Trash2, Key, Calendar, Code, Layers, Lock } from "lucide-react";
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
import { Permission } from "@/features/permission/schemas/permission.schema";
import { Access } from "@/components/access";
import { ALL_PERMISSIONS } from "@/shared/config/permissions";

interface PermissionTableProps {
  permissions: Permission[];
  isLoading?: boolean;
  onEdit: (permission: Permission) => void;
  onDelete: (id: string) => void;
  currentPage: number;
  pageSize: number;
}

export function PermissionTable({
  permissions,
  isLoading,
  onEdit,
  onDelete,
  currentPage,
  pageSize,
}: PermissionTableProps) {
  if (isLoading) {
    return <PermissionTableSkeleton />;
  }

  return (
    <Access permission={ALL_PERMISSIONS.PERMISSIONS.GET_PAGINATE}>
      <TooltipProvider>
        <div className="admin-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">STT</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>API Path</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12">
                    <div className="flex flex-col items-center justify-center gap-3 text-gray-500">
                      <Key className="h-12 w-12 text-gray-300" />
                      <div className="text-center">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          No permissions found
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                permissions.map((permission, index) => (
                <PermissionTableRow
                  key={permission._id}
                  permission={permission}
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
interface PermissionTableRowProps {
  permission: Permission;
  onEdit: (permission: Permission) => void;
  onDelete: (_id: string) => void;
  orderNumber: number;
}

function PermissionTableRow({
  permission,
  onEdit,
  onDelete,
  orderNumber,
}: PermissionTableRowProps) {
  // Get method badge color
  const getMethodBadgeClass = () => {
    switch (permission.method) {
      case "GET":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "POST":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800";
      case "PUT":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200 dark:border-orange-800";
      case "PATCH":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
      case "DELETE":
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800";
    }
  };

  return (
    <TableRow className="admin-table-row group">
      <TableCell className="text-center font-medium text-gray-500">
        {orderNumber}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-gray-400" />
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {permission.name}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4 text-gray-400" />
          <code className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
            {permission.apiPath}
          </code>
        </div>
      </TableCell>
      <TableCell>
        <Badge 
          variant="outline" 
          className={`font-mono font-semibold ${getMethodBadgeClass()}`}
        >
          {permission.method}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-gray-400" />
          <Badge variant="secondary" className="font-normal">
            {permission.module}
          </Badge>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm">
            {permission.createdAt
              ? new Date(permission.createdAt).toLocaleDateString()
              : "-"}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Access permission={ALL_PERMISSIONS.PERMISSIONS.UPDATE} hideChildren>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(permission)}
                  className="h-8 w-8 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit permission</p>
              </TooltipContent>
            </Tooltip>
          </Access>
          <Access permission={ALL_PERMISSIONS.PERMISSIONS.DELETE} hideChildren>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(permission._id)}
                  className="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete permission</p>
              </TooltipContent>
            </Tooltip>
          </Access>
        </div>
      </TableCell>
    </TableRow>
  );
}

// Skeleton loader component
function PermissionTableSkeleton() {
  return (
    <div className="admin-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">STT</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>API Path</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Module</TableHead>
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
                <Skeleton className="h-4 w-40" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-48" />
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
