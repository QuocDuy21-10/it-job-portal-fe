// CV Profile Types - Frontend Interface
// This matches the data structure used in create-cv-page.tsx

export interface ICVProfile {
  _id?: string;
  userId?: string;
  personalInfo: {
    fullName: string;
    phone: string;
    email: string;
    birthday?: Date | string;
    gender?: "male" | "female" | "other";
    address?: string;
    personalLink?: string;
    bio?: string;
  };
  education: Array<{
    id: string;
    school: string;
    degree: string;
    field: string;
    startDate: Date | string;
    endDate?: Date | string;
    description?: string;
  }>;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: Date | string;
    endDate?: Date | string;
    description?: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
    level: string;
  }>;
  languages: Array<{
    id: string;
    name: string;
    proficiency: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    link?: string;
  }>;
  certificates: Array<{
    id: string;
    name: string;
    issuer: string;
    date: Date | string;
  }>;
  awards: Array<{
    id: string;
    name: string;
    date: Date | string;
    description?: string;
  }>;
  isActive?: boolean;
  lastUpdated?: string;
  createdAt?: string;
  updatedAt?: string;
}
