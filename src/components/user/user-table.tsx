import { Pencil, Trash2, Calendar, Shield, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/features/user/schemas/user.schema";
import { useGetRoleQuery } from "@/features/role/redux/role.api";
import { Access } from "@/components/access";
import { EAction } from "@/lib/casl/ability";
import { cn } from "@/lib/utils";

interface UserTableProps {
  users: User[];
  isLoading?: boolean;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  onLock: (user: User) => void;
  onUnlock: (id: string) => void;
  currentPage: number;
  pageSize: number;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleAll: () => void;
  isAllSelected: boolean;
  isIndeterminate: boolean;
}

export function UserTable({
  users,
  isLoading,
  onEdit,
  onDelete,
  onLock,
  onUnlock,
  currentPage,
  pageSize,
  selectedIds,
  onToggleSelect,
  onToggleAll,
  isAllSelected,
  isIndeterminate,
}: UserTableProps) {
  if (isLoading) {
    return <UserTableSkeleton />;
  }

  return (
    <Access action={EAction.READ} subject="User">
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={isIndeterminate ? "indeterminate" : isAllSelected}
                    onCheckedChange={onToggleAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead className="w-[60px] text-center font-semibold text-gray-700 dark:text-gray-300">
                  STT
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                  User
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                  Email
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                  Role
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                  Created
                </TableHead>
                <TableHead className="text-right font-semibold text-gray-700 dark:text-gray-300">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-40 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-3 py-8">
                      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Shield className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          No users found
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user, index) => (
                  <UserTableRow
                    key={user._id}
                    user={user}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onLock={onLock}
                    onUnlock={onUnlock}
                    orderNumber={(currentPage - 1) * pageSize + index + 1}
                    isSelected={selectedIds.has(user._id)}
                    onToggleSelect={onToggleSelect}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Access>
  );
}

/**
 * Loading Skeleton Component
 */
function UserTableSkeleton() {
  return (
    <div className="admin-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-900/50">
              <TableHead className="w-[50px]" />
              <TableHead className="w-[60px]">#</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-8 mx-auto" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16" />
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
    </div>
  );
}

/**
 * Table Row Component
 * Enhanced with smooth hover and better visual hierarchy
 */
interface UserTableRowProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (_id: string) => void;
  onLock: (user: User) => void;
  onUnlock: (_id: string) => void;
  orderNumber: number;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

function UserTableRow({
  user,
  onEdit,
  onDelete,
  onLock,
  onUnlock,
  orderNumber,
  isSelected,
  onToggleSelect,
}: UserTableRowProps) {
  const { data: roleData } = useGetRoleQuery(user.role);
  const roleName = roleData?.data?.name || "Unknown Role";

  // Format date
  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "-";

  // Role badge color based on role name
  const getRoleBadgeColor = (role: string) => {
    const lowerRole = role.toLowerCase();
    if (lowerRole.includes("admin")) return "default";
    if (lowerRole.includes("hr")) return "secondary";
    if (lowerRole.includes("user")) return "outline";
    return "outline";
  };

  return (
    <TableRow
      className={cn(
        "border-gray-200 dark:border-gray-800",
        "hover:bg-gray-50 dark:hover:bg-gray-900/30",
        "transition-colors duration-200"
      )}
      data-state={isSelected ? "selected" : undefined}
    >
      {/* Checkbox */}
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(user._id)}
          aria-label={`Select ${user.name}`}
        />
      </TableCell>
      {/* Order Number */}
      <TableCell className="text-center font-medium text-gray-600 dark:text-gray-400">
        {orderNumber}
      </TableCell>

      {/* User Name */}
      <TableCell>
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {user.name}
          </span>
        </div>
      </TableCell>

      {/* Email */}
      <TableCell>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <span className="text-sm">{user.email}</span>
        </div>
      </TableCell>

      {/* Role */}
      <TableCell>
        <Badge
          variant={getRoleBadgeColor(roleName)}
          className="font-medium"
        >
          {roleName}
        </Badge>
      </TableCell>

      {/* Lock Status */}
      <TableCell>
        {user.isLocked ? (
          <Badge
            variant="destructive"
            className="flex items-center gap-1 w-fit font-medium"
          >
            <Lock className="h-3 w-3" />
            Locked
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="flex items-center gap-1 w-fit font-medium text-green-600 dark:text-green-400 border-green-200 dark:border-green-800"
          >
            <Unlock className="h-3 w-3" />
            Active
          </Badge>
        )}
      </TableCell>

      {/* Created Date */}
      <TableCell>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Calendar className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
          <span className="text-sm">{formattedDate}</span>
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell className="text-right">
        <TooltipProvider>
          <div className="flex justify-end gap-1">
            <Access action={EAction.UPDATE} subject="User" hideChildren>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(user)}
                    className="h-8 w-8 p-0 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    aria-label="Edit user"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit user</TooltipContent>
              </Tooltip>
            </Access>

            <Access action={EAction.UPDATE} subject="User" hideChildren>
              <Tooltip>
                <TooltipTrigger asChild>
                  {user.isLocked ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onUnlock(user._id)}
                      className="h-8 w-8 p-0 hover:bg-green-50 dark:hover:bg-green-950/30 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                      aria-label="Unlock user"
                    >
                      <Unlock className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onLock(user)}
                      className="h-8 w-8 p-0 hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                      aria-label="Lock user"
                    >
                      <Lock className="h-4 w-4" />
                    </Button>
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  {user.isLocked ? "Unlock user" : "Lock user"}
                </TooltipContent>
              </Tooltip>
            </Access>

            <Access action={EAction.DELETE} subject="User" hideChildren>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(user._id)}
                    className="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    aria-label="Delete user"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete user</TooltipContent>
              </Tooltip>
            </Access>
          </div>
        </TooltipProvider>
      </TableCell>
    </TableRow>
  );
}
