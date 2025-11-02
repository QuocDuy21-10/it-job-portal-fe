import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Permission } from "@/features/permission/schemas/permission.schema";

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
    return (
      <div className="bg-white rounded-lg border">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading permissions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border">
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
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                No permissions found
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
  return (
    <TableRow>
      <TableCell className="text-center">{orderNumber}</TableCell>
      <TableCell className="font-medium">{permission.name}</TableCell>
      <TableCell>{permission.apiPath}</TableCell>
      <TableCell>
        <Badge variant="outline">{permission.method}</Badge>
      </TableCell>
      <TableCell>
        <Badge variant="secondary">{permission.module}</Badge>
      </TableCell>
      <TableCell>
        {permission.createdAt
          ? new Date(permission.createdAt).toLocaleDateString()
          : "-"}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(permission)}
            title="Edit permission"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(permission._id)}
            title="Delete permission"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
