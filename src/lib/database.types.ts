export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      roles: {
        Row: {
          id: string
          name: string
          description: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          created_at?: string
          updated_at?: string
        }
      }
      permissions: {
        Row: {
          id: string
          name: string
          description: string
          resource: string
          action: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string
          resource: string
          action: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          resource?: string
          action?: string
          created_at?: string
        }
      }
      role_permissions: {
        Row: {
          id: string
          role_id: string
          permission_id: string
          created_at: string
        }
        Insert: {
          id?: string
          role_id: string
          permission_id: string
          created_at?: string
        }
        Update: {
          id?: string
          role_id?: string
          permission_id?: string
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string
          avatar_url: string
          role_id: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          phone?: string
          avatar_url?: string
          role_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone?: string
          avatar_url?: string
          role_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      companies: {
        Row: {
          id: string
          name: string
          logo_url: string
          description: string
          industry: string
          company_size: string
          website: string
          location: string
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          logo_url?: string
          description?: string
          industry?: string
          company_size?: string
          website?: string
          location?: string
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          logo_url?: string
          description?: string
          industry?: string
          company_size?: string
          website?: string
          location?: string
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          company_id: string
          title: string
          description: string
          requirements: string
          benefits: string
          location: string
          job_type: string
          experience_level: string
          salary_min: number
          salary_max: number
          salary_currency: string
          skills: string[]
          is_active: boolean
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          title: string
          description?: string
          requirements?: string
          benefits?: string
          location?: string
          job_type?: string
          experience_level?: string
          salary_min?: number
          salary_max?: number
          salary_currency?: string
          skills?: string[]
          is_active?: boolean
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          title?: string
          description?: string
          requirements?: string
          benefits?: string
          location?: string
          job_type?: string
          experience_level?: string
          salary_min?: number
          salary_max?: number
          salary_currency?: string
          skills?: string[]
          is_active?: boolean
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      resumes: {
        Row: {
          id: string
          user_id: string
          job_id: string
          cover_letter: string
          resume_url: string
          status: string
          applied_at: string
          reviewed_at: string | null
          notes: string
        }
        Insert: {
          id?: string
          user_id: string
          job_id: string
          cover_letter?: string
          resume_url?: string
          status?: string
          applied_at?: string
          reviewed_at?: string | null
          notes?: string
        }
        Update: {
          id?: string
          user_id?: string
          job_id?: string
          cover_letter?: string
          resume_url?: string
          status?: string
          applied_at?: string
          reviewed_at?: string | null
          notes?: string
        }
      }
    }
  }
}
