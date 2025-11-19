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
    return (
      <div className="bg-white rounded-lg border">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading companies...</div>
        </div>
      </div>
    );
  }

  return (
    <Access permission={ALL_PERMISSIONS.COMPANIES.GET_PAGINATE}>
      <div className="bg-white rounded-lg border">
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
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No companies found
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
  return (
    <TableRow>
      <TableCell className="text-center">{orderNumber}</TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <span className="font-medium">{company.name}</span>
        </div>
      </TableCell>
      <TableCell>{company.address}</TableCell>
      <TableCell>{company.website || "-"}</TableCell>
      <TableCell>
        {company.numberOfEmployees ? (
          <Badge variant="secondary">{company.numberOfEmployees}</Badge>
        ) : (
          "-"
        )}
      </TableCell>
      <TableCell>
        {new Date(company.createdAt || "").toLocaleDateString()}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <Access permission={ALL_PERMISSIONS.COMPANIES.UPDATE} hideChildren>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(company)}
              title="Edit company"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </Access>
          <Access permission={ALL_PERMISSIONS.COMPANIES.DELETE} hideChildren>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(company._id as string)}
              title="Delete company"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </Access>
        </div>
      </TableCell>
    </TableRow>
  );
}
