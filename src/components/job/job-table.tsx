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
import { Job } from "@/features/job/schemas/job.schema";

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
    return (
      <div className="bg-white rounded-lg border">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading jobs...</div>
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
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                No jobs found
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
  return (
    <TableRow>
      <TableCell className="text-center">{orderNumber}</TableCell>
      <TableCell className="font-medium">{job.name}</TableCell>
      <TableCell>{job.location}</TableCell>
      <TableCell>{job.salary.toLocaleString()} VND</TableCell>
      <TableCell>{job.level}</TableCell>
      <TableCell>
        {job.isActive ? (
          <Badge variant="secondary">Active</Badge>
        ) : (
          <Badge variant="destructive">Inactive</Badge>
        )}
      </TableCell>
      <TableCell>
        {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "-"}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(job)}
            title="Edit job"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(job._id)}
            title="Delete job"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
