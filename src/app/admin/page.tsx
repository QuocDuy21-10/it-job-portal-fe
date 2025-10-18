'use client';

import { useEffect, useState } from 'react';
import { Users, Building2, Briefcase, FileText, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    companies: 0,
    jobs: 0,
    resumes: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      const [usersResult, companiesResult, jobsResult, resumesResult] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('companies').select('*', { count: 'exact', head: true }),
        supabase.from('jobs').select('*', { count: 'exact', head: true }),
        supabase.from('resumes').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        users: usersResult.count || 0,
        companies: companiesResult.count || 0,
        jobs: jobsResult.count || 0,
        resumes: resumesResult.count || 0,
      });
    }

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.users,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Companies',
      value: stats.companies,
      icon: Building2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Active Jobs',
      value: stats.jobs,
      icon: Briefcase,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Applications',
      value: stats.resumes,
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Manage your job portal efficiently
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-full`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-sm text-gray-600">Total Entities</span>
                <span className="font-semibold">{stats.users + stats.companies + stats.jobs + stats.resumes}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-sm text-gray-600">Active Job Postings</span>
                <span className="font-semibold">{stats.jobs}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-sm text-gray-600">Pending Applications</span>
                <span className="font-semibold">{stats.resumes}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Registered Companies</span>
                <span className="font-semibold">{stats.companies}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">System initialized</p>
                  <p className="text-xs text-gray-500">Database tables created and populated with mock data</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Admin panel ready</p>
                  <p className="text-xs text-gray-500">All CRUD operations available</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 bg-purple-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Public pages active</p>
                  <p className="text-xs text-gray-500">Job listings and company profiles are live</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
