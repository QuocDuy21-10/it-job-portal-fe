/**
 * CV Profile Types
 * Định nghĩa các interface cho CV Profile theo API spec
 */

export interface ICVPersonalInfo {
  fullName: string;
  phone: string;
  email: string;
  birthday: string;
  gender: string;
  address: string;
  personalLink: string;
  bio: string;
  isDeleted?: boolean;
  deletedAt?: string | null;
}

export interface ICVEducation {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
  isDeleted?: boolean;
  deletedAt?: string | null;
}

export interface ICVExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  isDeleted?: boolean;
  deletedAt?: string | null;
}

export interface ICVSkill {
  id: string;
  name: string;
  level: string;
  isDeleted?: boolean;
  deletedAt?: string | null;
}

export interface ICVLanguage {
  id: string;
  name: string;
  proficiency: string;
  isDeleted?: boolean;
  deletedAt?: string | null;
}

export interface ICVProject {
  id: string;
  name: string;
  description: string;
  link: string;
  isDeleted?: boolean;
  deletedAt?: string | null;
}

export interface ICVCertificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  isDeleted?: boolean;
  deletedAt?: string | null;
}

export interface ICVAward {
  id: string;
  name: string;
  date: string;
  description: string;
  isDeleted?: boolean;
  deletedAt?: string | null;
}

/**
 * Main CV Profile Interface
 */
export interface ICVProfile {
  _id?: string;
  userId?: string;
  personalInfo: ICVPersonalInfo;
  education: ICVEducation[];
  experience: ICVExperience[];
  skills: ICVSkill[];
  languages: ICVLanguage[];
  projects: ICVProject[];
  certificates: ICVCertificate[];
  awards: ICVAward[];
  isActive?: boolean;
  lastUpdated?: string;
  isDeleted?: boolean;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

/**
 * API Request/Response Types
 */
export interface IUpsertCVProfileRequest {
  personalInfo: Omit<ICVPersonalInfo, "isDeleted" | "deletedAt">;
  education: Omit<ICVEducation, "isDeleted" | "deletedAt">[];
  experience: Omit<ICVExperience, "isDeleted" | "deletedAt">[];
  skills: Omit<ICVSkill, "isDeleted" | "deletedAt">[];
  languages: Omit<ICVLanguage, "isDeleted" | "deletedAt">[];
  projects: Omit<ICVProject, "isDeleted" | "deletedAt">[];
  certificates: Omit<ICVCertificate, "isDeleted" | "deletedAt">[];
  awards: Omit<ICVAward, "isDeleted" | "deletedAt">[];
}

export interface IUpsertCVProfileResponse {
  statusCode: number;
  message: string | null;
  data: {
    statusCode: number;
    message: string;
    data: ICVProfile;
  };
}
