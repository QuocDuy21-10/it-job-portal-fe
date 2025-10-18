'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface Job {
  id: string;
  company_id: string;
  title: string;
  location: string;
  job_type: string;
  experience_level: string;
  salary_min: number;
  salary_max: number;
  is_active: boolean;
  companies: { name: string };
}

interface Company {
  id: string;
  name: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState({
    company_id: '',
    title: '',
    location: '',
    job_type: 'full-time',
    experience_level: 'mid',
    salary_min: 0,
    salary_max: 0,
    is_active: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchJobs();
    fetchCompanies();
  }, []);

  async function fetchJobs() {
    const { data } = await supabase
      .from('jobs')
      .select('*, companies(name)')
      .order('created_at', { ascending: false });
    if (data) setJobs(data as any);
  }

  async function fetchCompanies() {
    const { data } = await supabase.from('companies').select('id, name');
    if (data) setCompanies(data);
  }

  function handleOpenDialog(job?: Job) {
    if (job) {
      setEditingJob(job);
      setFormData({
        company_id: job.company_id,
        title: job.title,
        location: job.location,
        job_type: job.job_type,
        experience_level: job.experience_level,
        salary_min: job.salary_min,
        salary_max: job.salary_max,
        is_active: job.is_active,
      });
    } else {
      setEditingJob(null);
      setFormData({
        company_id: companies[0]?.id || '',
        title: '',
        location: '',
        job_type: 'full-time',
        experience_level: 'mid',
        salary_min: 0,
        salary_max: 0,
        is_active: true,
      });
    }
    setIsDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (editingJob) {
      const { error } = await supabase
        .from('jobs')
        .update(formData)
        .eq('id', editingJob.id);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Job updated successfully' });
        fetchJobs();
        setIsDialogOpen(false);
      }
    } else {
      const { error } = await supabase.from('jobs').insert([formData]);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Job created successfully' });
        fetchJobs();
        setIsDialogOpen(false);
      }
    }
  }

  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this job?')) {
      const { error } = await supabase.from('jobs').delete().eq('id', id);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Job deleted successfully' });
        fetchJobs();
      }
    }
  }

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.companies?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Jobs</h1>
          <p className="text-gray-600 mt-1">Manage job postings</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Job
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingJob ? 'Edit Job' : 'Add New Job'}</DialogTitle>
                <DialogDescription>
                  {editingJob ? 'Update job posting' : 'Create a new job posting'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="company">Company</Label>
                  <Select value={formData.company_id} onValueChange={(value) => setFormData({ ...formData, company_id: value })}>
                    <SelectTrigger id="company">
                      <SelectValue placeholder="Select a company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="job_type">Job Type</Label>
                    <Select value={formData.job_type} onValueChange={(value) => setFormData({ ...formData, job_type: value })}>
                      <SelectTrigger id="job_type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full Time</SelectItem>
                        <SelectItem value="part-time">Part Time</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="experience_level">Experience</Label>
                    <Select value={formData.experience_level} onValueChange={(value) => setFormData({ ...formData, experience_level: value })}>
                      <SelectTrigger id="experience_level">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="junior">Junior</SelectItem>
                        <SelectItem value="mid">Mid</SelectItem>
                        <SelectItem value="senior">Senior</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="salary_min">Min Salary</Label>
                    <Input
                      id="salary_min"
                      type="number"
                      value={formData.salary_min}
                      onChange={(e) => setFormData({ ...formData, salary_min: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="salary_max">Max Salary</Label>
                    <Input
                      id="salary_max"
                      type="number"
                      value={formData.salary_max}
                      onChange={(e) => setFormData({ ...formData, salary_max: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="is_active" className="font-normal">Active</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{editingJob ? 'Update' : 'Create'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
          <Input
            placeholder="Search jobs..."
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
              <TableHead>Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Salary Range</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredJobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No jobs found
                </TableCell>
              </TableRow>
            ) : (
              filteredJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.companies?.name}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell className="capitalize">{job.job_type}</TableCell>
                  <TableCell>${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={job.is_active ? 'default' : 'secondary'}>
                      {job.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(job)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(job.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
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
