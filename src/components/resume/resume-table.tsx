import { Pencil } from "lucide-react";
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
import { Resume } from "@/features/resume/schemas/resume.schema";

interface ResumeTableProps {
  resumes: Resume[];
  isLoading?: boolean;
  onEdit: (resume: Resume) => void;
  currentPage: number;
  pageSize: number;
}

export function ResumeTable({
  resumes,
  isLoading,
  onEdit,
  currentPage,
  pageSize,
}: ResumeTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading resumes...</div>
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
            <TableHead>Email</TableHead>
            <TableHead>Link</TableHead>
            <TableHead>Job</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resumes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                No resumes found
              </TableCell>
            </TableRow>
          ) : (
            resumes.map((resume, index) => (
              <ResumeTableRow
                key={resume._id}
                resume={resume}
                onEdit={onEdit}
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
interface ResumeTableRowProps {
  resume: Resume;
  onEdit: (resume: Resume) => void;
  orderNumber: number;
}

function ResumeTableRow({ resume, onEdit, orderNumber }: ResumeTableRowProps) {
  return (
    <TableRow>
      <TableCell className="text-center">{orderNumber}</TableCell>
      <TableCell>{resume.email}</TableCell>
      <TableCell>
        <a
          href={resume.url}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 hover:underline"
        >
          View
        </a>
      </TableCell>
      <TableCell>{resume.jobId || "-"}</TableCell>
      <TableCell>{resume.companyId || "-"}</TableCell>
      <TableCell>
        <Badge variant="outline">{resume.status.toUpperCase()}</Badge>
      </TableCell>
      <TableCell>
        {resume.createdAt
          ? new Date(resume.createdAt).toLocaleDateString()
          : "-"}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(resume)}
            title="Edit resume"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
