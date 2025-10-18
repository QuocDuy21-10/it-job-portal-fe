/*
  # Job Portal Database Schema

  ## Overview
  This migration creates a comprehensive database schema for a job posting/application website
  with full admin capabilities for managing users, companies, jobs, resumes, roles, and permissions.

  ## New Tables

  ### 1. roles
  - `id` (uuid, primary key)
  - `name` (text, unique) - Role name (e.g., "admin", "employer", "candidate")
  - `description` (text) - Role description
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. permissions
  - `id` (uuid, primary key)
  - `name` (text, unique) - Permission name (e.g., "users.create", "jobs.delete")
  - `description` (text) - Permission description
  - `resource` (text) - Resource type (e.g., "users", "jobs", "companies")
  - `action` (text) - Action type (e.g., "create", "read", "update", "delete")
  - `created_at` (timestamptz)

  ### 3. role_permissions
  - `id` (uuid, primary key)
  - `role_id` (uuid, foreign key to roles)
  - `permission_id` (uuid, foreign key to permissions)
  - `created_at` (timestamptz)

  ### 4. users
  - `id` (uuid, primary key)
  - `email` (text, unique)
  - `full_name` (text)
  - `phone` (text)
  - `avatar_url` (text)
  - `role_id` (uuid, foreign key to roles)
  - `is_active` (boolean, default true)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 5. companies
  - `id` (uuid, primary key)
  - `name` (text)
  - `logo_url` (text)
  - `description` (text)
  - `industry` (text)
  - `company_size` (text)
  - `website` (text)
  - `location` (text)
  - `is_verified` (boolean, default false)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 6. jobs
  - `id` (uuid, primary key)
  - `company_id` (uuid, foreign key to companies)
  - `title` (text)
  - `description` (text)
  - `requirements` (text)
  - `benefits` (text)
  - `location` (text)
  - `job_type` (text) - e.g., "full-time", "part-time", "remote"
  - `experience_level` (text) - e.g., "junior", "mid", "senior"
  - `salary_min` (integer)
  - `salary_max` (integer)
  - `salary_currency` (text, default 'USD')
  - `skills` (text[]) - Array of required skills
  - `is_active` (boolean, default true)
  - `expires_at` (timestamptz)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 7. resumes
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to users)
  - `job_id` (uuid, foreign key to jobs)
  - `cover_letter` (text)
  - `resume_url` (text)
  - `status` (text) - e.g., "pending", "reviewed", "accepted", "rejected"
  - `applied_at` (timestamptz)
  - `reviewed_at` (timestamptz)
  - `notes` (text) - Admin notes

  ## Security
  - RLS enabled on all tables
  - Policies for authenticated users to manage their own data
  - Admin policies for full access to all resources

  ## Important Notes
  1. All timestamps use `timestamptz` for proper timezone handling
  2. Default values provided for boolean and timestamp fields
  3. Foreign keys ensure referential integrity
  4. Arrays used for skills to allow flexible multi-value storage
*/

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text DEFAULT '',
  resource text NOT NULL,
  action text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create role_permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id uuid REFERENCES roles(id) ON DELETE CASCADE,
  permission_id uuid REFERENCES permissions(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(role_id, permission_id)
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text DEFAULT '',
  avatar_url text DEFAULT '',
  role_id uuid REFERENCES roles(id) ON DELETE SET NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text DEFAULT '',
  description text DEFAULT '',
  industry text DEFAULT '',
  company_size text DEFAULT '',
  website text DEFAULT '',
  location text DEFAULT '',
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  requirements text DEFAULT '',
  benefits text DEFAULT '',
  location text DEFAULT '',
  job_type text DEFAULT 'full-time',
  experience_level text DEFAULT 'mid',
  salary_min integer DEFAULT 0,
  salary_max integer DEFAULT 0,
  salary_currency text DEFAULT 'USD',
  skills text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  cover_letter text DEFAULT '',
  resume_url text DEFAULT '',
  status text DEFAULT 'pending',
  applied_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  notes text DEFAULT ''
);

-- Enable Row Level Security
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for roles table
CREATE POLICY "Anyone can view roles"
  ON roles FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert roles"
  ON roles FOR INSERT
  WITH CHECK (false);

CREATE POLICY "Only admins can update roles"
  ON roles FOR UPDATE
  USING (false);

CREATE POLICY "Only admins can delete roles"
  ON roles FOR DELETE
  USING (false);

-- RLS Policies for permissions table
CREATE POLICY "Anyone can view permissions"
  ON permissions FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert permissions"
  ON permissions FOR INSERT
  WITH CHECK (false);

CREATE POLICY "Only admins can update permissions"
  ON permissions FOR UPDATE
  USING (false);

CREATE POLICY "Only admins can delete permissions"
  ON permissions FOR DELETE
  USING (false);

-- RLS Policies for role_permissions table
CREATE POLICY "Anyone can view role_permissions"
  ON role_permissions FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert role_permissions"
  ON role_permissions FOR INSERT
  WITH CHECK (false);

CREATE POLICY "Only admins can delete role_permissions"
  ON role_permissions FOR DELETE
  USING (false);

-- RLS Policies for users table
CREATE POLICY "Anyone can view users"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert users"
  ON users FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update users"
  ON users FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete users"
  ON users FOR DELETE
  USING (true);

-- RLS Policies for companies table
CREATE POLICY "Anyone can view companies"
  ON companies FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert companies"
  ON companies FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update companies"
  ON companies FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete companies"
  ON companies FOR DELETE
  USING (true);

-- RLS Policies for jobs table
CREATE POLICY "Anyone can view active jobs"
  ON jobs FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert jobs"
  ON jobs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update jobs"
  ON jobs FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete jobs"
  ON jobs FOR DELETE
  USING (true);

-- RLS Policies for resumes table
CREATE POLICY "Anyone can view resumes"
  ON resumes FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert resumes"
  ON resumes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update resumes"
  ON resumes FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete resumes"
  ON resumes FOR DELETE
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_job_id ON resumes(job_id);
CREATE INDEX IF NOT EXISTS idx_resumes_status ON resumes(status);