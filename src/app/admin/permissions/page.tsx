'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
  created_at: string;
}

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    resource: '',
    action: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPermissions();
  }, []);

  async function fetchPermissions() {
    const { data } = await supabase
      .from('permissions')
      .select('*')
      .order('resource', { ascending: true });
    if (data) setPermissions(data);
  }

  function handleOpenDialog(permission?: Permission) {
    if (permission) {
      setEditingPermission(permission);
      setFormData({
        name: permission.name,
        description: permission.description,
        resource: permission.resource,
        action: permission.action,
      });
    } else {
      setEditingPermission(null);
      setFormData({ name: '', description: '', resource: '', action: '' });
    }
    setIsDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (editingPermission) {
      const { error } = await supabase
        .from('permissions')
        .update(formData)
        .eq('id', editingPermission.id);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Permission updated successfully' });
        fetchPermissions();
        setIsDialogOpen(false);
      }
    } else {
      const { error } = await supabase.from('permissions').insert([formData]);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Permission created successfully' });
        fetchPermissions();
        setIsDialogOpen(false);
      }
    }
  }

  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this permission?')) {
      const { error } = await supabase.from('permissions').delete().eq('id', id);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Permission deleted successfully' });
        fetchPermissions();
      }
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Permissions</h1>
          <p className="text-gray-600 mt-1">Manage system permissions</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Permission
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingPermission ? 'Edit Permission' : 'Add New Permission'}</DialogTitle>
                <DialogDescription>
                  {editingPermission ? 'Update permission details' : 'Create a new permission'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Permission Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., users.create"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="resource">Resource</Label>
                  <Input
                    id="resource"
                    value={formData.resource}
                    onChange={(e) => setFormData({ ...formData, resource: e.target.value })}
                    placeholder="e.g., users, jobs, companies"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="action">Action</Label>
                  <Input
                    id="action"
                    value={formData.action}
                    onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                    placeholder="e.g., create, read, update, delete"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{editingPermission ? 'Update' : 'Create'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Action</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No permissions found
                </TableCell>
              </TableRow>
            ) : (
              permissions.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell className="font-medium">{permission.name}</TableCell>
                  <TableCell>{permission.description}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{permission.resource}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{permission.action}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(permission)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(permission.id)}>
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
