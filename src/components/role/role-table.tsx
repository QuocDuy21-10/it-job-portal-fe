"use client";
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
    return (
      <div className="bg-white rounded-lg border">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading roles...</div>
        </div>
      </div>
    );
  }

  return (
    <Access permission={ALL_PERMISSIONS.ROLES.GET_PAGINATE}>
      <div className="bg-white rounded-lg border">
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
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No roles found
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
  return (
    <TableRow>
      <TableCell className="text-center">{orderNumber}</TableCell>
      <TableCell className="font-medium">{role.name}</TableCell>
      <TableCell>{role.description || "-"}</TableCell>
      <TableCell>
        {role.isActive ? (
          <Badge variant="secondary">Active</Badge>
        ) : (
          <Badge variant="destructive">Inactive</Badge>
        )}
      </TableCell>
      <TableCell>
        {role.createdAt ? new Date(role.createdAt).toLocaleDateString() : "-"}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <Access permission={ALL_PERMISSIONS.ROLES.UPDATE} hideChildren>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(role)}
              title="Edit role"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </Access>
          <Access permission={ALL_PERMISSIONS.ROLES.DELETE} hideChildren>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(role._id)}
              title="Delete role"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </Access>
        </div>
      </TableCell>
    </TableRow>
  );
}
