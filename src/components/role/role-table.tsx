"use client";
import { Pencil, Trash2, Shield, Calendar, Users, CheckCircle, XCircle } from "lucide-react";
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
import { Role } from "@/features/role/schemas/role.schema";
import { Access } from "@/components/access";
import { ALL_PERMISSIONS } from "@/shared/config/permissions";

interface RoleTableProps {
  roles: Role[];
  isLoading?: boolean;
  onEdit: (role: Role) => void;
  onDelete: (id: string) => void;
  currentPage: number;
  pageSize: number;
}

export function RoleTable({
  roles,
  isLoading,
  onEdit,
  onDelete,
  currentPage,
  pageSize,
}: RoleTableProps) {
  if (isLoading) {
    return <RoleTableSkeleton />;
  }

  return (
    <Access permission={ALL_PERMISSIONS.ROLES.GET_PAGINATE}>
      <TooltipProvider>
        <div className="admin-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">STT</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>IsActive</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12">
                    <div className="flex flex-col items-center justify-center gap-3 text-gray-500">
                      <Shield className="h-12 w-12 text-gray-300" />
                      <div className="text-center">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          No roles found
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                roles.map((role, index) => (
                <RoleTableRow
                  key={role._id}
                  role={role}
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
interface RoleTableRowProps {
  role: Role;
  onEdit: (role: Role) => void;
  onDelete: (_id: string) => void;
  orderNumber: number;
}

function RoleTableRow({
  role,
  onEdit,
  onDelete,
  orderNumber,
}: RoleTableRowProps) {
  // Determine badge color based on role name
  const getRoleBadgeColor = () => {
    const name = role.name?.toLowerCase() || "";
    if (name.includes("admin")) return "from-red-500 to-red-600";
    if (name.includes("manager")) return "from-orange-500 to-orange-600";
    if (name.includes("user")) return "from-blue-500 to-blue-600";
    if (name.includes("hr")) return "from-green-500 to-green-600";
    return "from-purple-500 to-purple-600";
  };
  
  return (
    <TableRow className="admin-table-row group">
      <TableCell className="text-center font-medium text-gray-500">
        {orderNumber}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          {/* Role Avatar */}
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {role.name}
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {role.description || "-"}
        </span>
      </TableCell>
      <TableCell>
        {role.isActive ? (
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
            {role.createdAt ? new Date(role.createdAt).toLocaleDateString() : "-"}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Access permission={ALL_PERMISSIONS.ROLES.UPDATE} hideChildren>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(role)}
                  className="h-8 w-8 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit role</p>
              </TooltipContent>
            </Tooltip>
          </Access>
          <Access permission={ALL_PERMISSIONS.ROLES.DELETE} hideChildren>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(role._id)}
                  className="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete role</p>
              </TooltipContent>
            </Tooltip>
          </Access>
        </div>
      </TableCell>
    </TableRow>
  );
}

// Skeleton loader component
function RoleTableSkeleton() {
  return (
    <div className="admin-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">STT</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
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
                  <Skeleton className="h-4 w-32" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-48" />
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
