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
import { User } from "@/features/user/schemas/user.schema";
import { useGetRoleQuery } from "@/features/role/redux/role.api";
import { Access } from "@/components/access";
import { ALL_PERMISSIONS } from "@/shared/config/permissions";

interface UserTableProps {
  users: User[];
  isLoading?: boolean;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  currentPage: number;
  pageSize: number;
}

export function UserTable({
  users,
  isLoading,
  onEdit,
  onDelete,
  currentPage,
  pageSize,
}: UserTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading users...</div>
        </div>
      </div>
    );
  }

  return (
    <Access permission={ALL_PERMISSIONS.USERS.GET_PAGINATE}>
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">STT</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user, index) => (
                <UserTableRow
                  key={user._id}
                  user={user}
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
interface UserTableRowProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (_id: string) => void;
  orderNumber: number;
}

function UserTableRow({
  user,
  onEdit,
  onDelete,
  orderNumber,
}: UserTableRowProps) {
  const { data: roleData } = useGetRoleQuery(user.role);
  const roleName = roleData?.data?.name || "Unknown Role";

  return (
    <TableRow>
      <TableCell className="text-center">{orderNumber}</TableCell>
      <TableCell className="font-medium">{user.name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <Badge variant="outline">{roleName}</Badge>
      </TableCell>
      <TableCell>
        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <Access permission={ALL_PERMISSIONS.USERS.UPDATE} hideChildren>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(user)}
              title="Edit user"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </Access>
          <Access permission={ALL_PERMISSIONS.USERS.DELETE} hideChildren>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(user._id)}
              title="Delete user"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </Access>
        </div>
      </TableCell>
    </TableRow>
  );
}
