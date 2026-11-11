import type {
  CVProfile,
  UpsertCVProfileRequest,
} from "@/features/cv-builder/schemas/cv-profile.schema";
import type { CVData } from "@/shared/types/cv";

export const initialCVData: CVData = {
  personalInfo: {
    avatar: "",
    title: "",
    fullName: "",
    phone: "",
    email: "",
    birthday: undefined,
    gender: "male",
    address: "",
    personalLink: "",
    bio: "",
  },
  education: [],
  experience: [],
  skills: [],
  languages: [],
  projects: [],
  certificates: [],
  awards: [],
};

export const createLocalId = () =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const toDate = (value?: Date | string) => {
  if (!value) return undefined;
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? undefined : value;
  }
  const d = new Date(value);
  return isNaN(d.getTime()) ? undefined : d;
};

export const safeToISOString = (date?: Date | string): string | undefined => {
  if (!date) return undefined;
  if (typeof date === "string") return date;
  if (date instanceof Date) {
    return isNaN(date.getTime()) ? undefined : date.toISOString();
  }
  return undefined;
};

export const normalizeGender = (
  gender?: CVProfile["personalInfo"]["gender"]
): "male" | "female" | "other" | undefined => {
  if (gender === "male" || gender === "female" || gender === "other") {
    return gender;
  }

  return undefined;
};

export const normalizeCVProfile = (profile: CVProfile): CVData => ({
  _id: profile._id,
  userId: profile.userId,
  personalInfo: {
    avatar: profile.personalInfo?.avatar || "",
    title: profile.personalInfo?.title || "",
    fullName: profile.personalInfo?.fullName || "",
    phone: profile.personalInfo?.phone || "",
    email: profile.personalInfo?.email || "",
    birthday: toDate(profile.personalInfo?.birthday),
    gender: normalizeGender(profile.personalInfo?.gender),
    address: profile.personalInfo?.address || "",
    personalLink: profile.personalInfo?.personalLink || "",
    bio: profile.personalInfo?.bio || "",
  },
  education: (profile.education || []).map((edu: any) => ({
    id: edu.id || createLocalId(),
    school: edu.school,
    degree: edu.degree,
    field: edu.field,
    startDate: toDate(edu.startDate) || edu.startDate,
    endDate: toDate(edu.endDate),
    description: edu.description || "",
  })),
  experience: (profile.experience || []).map((exp: any) => ({
    id: exp.id || createLocalId(),
    company: exp.company,
    position: exp.position,
    startDate: toDate(exp.startDate) || exp.startDate,
    endDate: toDate(exp.endDate),
    description: exp.description || "",
  })),
  skills: (profile.skills || []).map((skill: any) => ({
    id: skill.id || createLocalId(),
    name: skill.name,
    level: skill.level,
  })),
  languages: (profile.languages || []).map((lang: any) => ({
    id: lang.id || createLocalId(),
    name: lang.name,
    proficiency: lang.proficiency,
  })),
  projects: (profile.projects || []).map((proj: any) => ({
    id: proj.id || createLocalId(),
    name: proj.name,
    position: proj.position || "",
    description: proj.description,
    link: proj.link || "",
  })),
  certificates: (profile.certificates || []).map((cert: any) => ({
    id: cert.id || createLocalId(),
    name: cert.name,
    issuer: cert.issuer,
    date: toDate(cert.date) || cert.date,
  })),
  awards: (profile.awards || []).map((award: any) => ({
    id: award.id || createLocalId(),
    name: award.name,
    date: toDate(award.date) || award.date,
    description: award.description || "",
  })),
  isActive: profile.isActive,
  isDraft: profile.isDraft,
  lastUpdated: profile.lastUpdated || profile.updatedAt,
  createdAt: profile.createdAt,
  updatedAt: profile.updatedAt,
});

export const toUpsertCVProfileRequest = (
  cvData: CVData
): UpsertCVProfileRequest => ({
  personalInfo: {
    avatar: cvData.personalInfo.avatar || undefined,
    title: cvData.personalInfo.title || undefined,
    fullName: cvData.personalInfo.fullName,
    phone: cvData.personalInfo.phone,
    email: cvData.personalInfo.email,
    birthday: cvData.personalInfo.birthday || undefined,
    gender: cvData.personalInfo.gender || "male",
    address: cvData.personalInfo.address || undefined,
    personalLink: cvData.personalInfo.personalLink || undefined,
    bio: cvData.personalInfo.bio || undefined,
  },
  education: (cvData.education || []).map((edu) => ({
    id: edu.id, // Include id for upsert
    school: edu.school,
    degree: edu.degree,
    field: edu.field,
    startDate: safeToISOString(edu.startDate) || "",
    endDate: safeToISOString(edu.endDate),
    description: edu.description || undefined,
  })),
  experience: (cvData.experience || []).map((exp) => ({
    id: exp.id, // Include id for upsert
    company: exp.company,
    position: exp.position,
    startDate: safeToISOString(exp.startDate) || "",
    endDate: safeToISOString(exp.endDate),
    description: exp.description || undefined,
  })),
  skills: (cvData.skills || []).map((skill) => ({
    id: skill.id, // Include id for upsert
    name: skill.name,
    level: skill.level,
  })),
  languages: (cvData.languages || []).map((lang) => ({
    id: lang.id, // Include id for upsert
    name: lang.name,
    proficiency: lang.proficiency,
  })),
  projects: (cvData.projects || []).map((proj) => ({
    id: proj.id, // Include id for upsert
    name: proj.name,
    position: proj.position,
    description: proj.description,
    link: proj.link || undefined,
  })),
  certificates: (cvData.certificates || []).map((cert) => ({
    id: cert.id, // Include id for upsert
    name: cert.name,
    issuer: cert.issuer,
    date: safeToISOString(cert.date) || "",
  })),
  awards: (cvData.awards || []).map((award) => ({
    id: award.id, // Include id for upsert
    name: award.name,
    date: safeToISOString(award.date) || "",
    description: award.description || undefined,
  })),
});
