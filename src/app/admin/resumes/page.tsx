'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface Resume {
  id: string;
  status: string;
  applied_at: string;
  users: { full_name: string; email: string };
  jobs: { title: string; companies: { name: string } };
}

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchResumes();
  }, []);

  async function fetchResumes() {
    const { data } = await supabase
      .from('resumes')
      .select('*, users(full_name, email), jobs(title, companies(name))')
      .order('applied_at', { ascending: false });
    if (data) setResumes(data as any);
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase
      .from('resumes')
      .update({ status, reviewed_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Status updated successfully' });
      fetchResumes();
    }
  }

  const filteredResumes = resumes.filter(
    (resume) =>
      resume.users?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resume.jobs?.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Applications</h1>
        <p className="text-gray-600 mt-1">Manage job applications</p>
      </div>

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
          <Input
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Applied Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResumes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No applications found
                </TableCell>
              </TableRow>
            ) : (
              filteredResumes.map((resume) => (
                <TableRow key={resume.id}>
                  <TableCell className="font-medium">{resume.users?.full_name}</TableCell>
                  <TableCell>{resume.users?.email}</TableCell>
                  <TableCell>{resume.jobs?.title}</TableCell>
                  <TableCell>{resume.jobs?.companies?.name}</TableCell>
                  <TableCell>
                    {new Date(resume.applied_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>
                    <Select value={resume.status} onValueChange={(value) => updateStatus(resume.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="reviewed">Reviewed</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
