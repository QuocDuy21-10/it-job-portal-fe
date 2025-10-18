'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface Company {
  id: string;
  name: string;
  logo_url: string;
  description: string;
  industry: string;
  company_size: string;
  website: string;
  location: string;
  is_verified: boolean;
  created_at: string;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    logo_url: '',
    description: '',
    industry: '',
    company_size: '',
    website: '',
    location: '',
    is_verified: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCompanies();
  }, []);

  async function fetchCompanies() {
    const { data } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setCompanies(data);
  }

  function handleOpenDialog(company?: Company) {
    if (company) {
      setEditingCompany(company);
      setFormData({
        name: company.name,
        logo_url: company.logo_url,
        description: company.description,
        industry: company.industry,
        company_size: company.company_size,
        website: company.website,
        location: company.location,
        is_verified: company.is_verified,
      });
    } else {
      setEditingCompany(null);
      setFormData({
        name: '',
        logo_url: '',
        description: '',
        industry: '',
        company_size: '',
        website: '',
        location: '',
        is_verified: false,
      });
    }
    setIsDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (editingCompany) {
      const { error } = await supabase
        .from('companies')
        .update({
          name: formData.name,
          logo_url: formData.logo_url,
          description: formData.description,
          industry: formData.industry,
          company_size: formData.company_size,
          website: formData.website,
          location: formData.location,
          is_verified: formData.is_verified,
        })
        .eq('id', editingCompany.id);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Company updated successfully' });
        fetchCompanies();
        setIsDialogOpen(false);
      }
    } else {
      const { error } = await supabase.from('companies').insert([{
        name: formData.name,
        logo_url: formData.logo_url,
        description: formData.description,
        industry: formData.industry,
        company_size: formData.company_size,
        website: formData.website,
        location: formData.location,
        is_verified: formData.is_verified,
      }]);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Company created successfully' });
        fetchCompanies();
        setIsDialogOpen(false);
      }
    }
  }

  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this company?')) {
      const { error } = await supabase.from('companies').delete().eq('id', id);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Company deleted successfully' });
        fetchCompanies();
      }
    }
  }

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Companies</h1>
          <p className="text-gray-600 mt-1">Manage company profiles</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Company
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingCompany ? 'Edit Company' : 'Add New Company'}</DialogTitle>
                <DialogDescription>
                  {editingCompany ? 'Update company information' : 'Create a new company profile'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Company Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="logo_url">Logo URL</Label>
                  <Input
                    id="logo_url"
                    value={formData.logo_url}
                    onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="company_size">Company Size</Label>
                    <Input
                      id="company_size"
                      value={formData.company_size}
                      onChange={(e) => setFormData({ ...formData, company_size: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
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
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_verified"
                    checked={formData.is_verified}
                    onChange={(e) => setFormData({ ...formData, is_verified: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="is_verified" className="font-normal">Verified Company</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{editingCompany ? 'Update' : 'Create'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
          <Input
            placeholder="Search companies..."
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
              <TableHead>Name</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCompanies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No companies found
                </TableCell>
              </TableRow>
            ) : (
              filteredCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>{company.industry}</TableCell>
                  <TableCell>{company.location}</TableCell>
                  <TableCell>{company.company_size}</TableCell>
                  <TableCell>
                    <Badge variant={company.is_verified ? 'default' : 'secondary'}>
                      {company.is_verified ? 'Verified' : 'Unverified'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(company)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(company.id)}
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
