import { z } from "zod";

// Personal Info Schema (with detailed validation)
export const PersonalInfoSchema = z.object({
  avatar: z.string().optional(),
  title: z.string().min(2, "Tiêu đề phải có ít nhất 2 ký tự").max(100, "Tiêu đề không được quá 100 ký tự").optional(),
  fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự").max(100, "Họ tên không được quá 100 ký tự"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ").max(15, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không hợp lệ"),
  birthday: z.date().optional(),
  gender: z.enum(["male", "female", "other"]),
  address: z.string().max(200, "Địa chỉ không được quá 200 ký tự").optional(),
  personalLink: z.string().url("Link không hợp lệ").optional().or(z.literal("")),
  bio: z.string().max(500, "Bio không được quá 500 ký tự").optional(),
});

// Education Schema (for Request - with id for upsert)
export const EducationRequestSchema = z.object({
  id: z.string().optional(), // Optional for new items, required for updates
  school: z.string().min(2, "Tên trường phải có ít nhất 2 ký tự").max(200, "Tên trường không được quá 200 ký tự"),
  degree: z.string().min(2, "Bằng cấp phải có ít nhất 2 ký tự").max(100, "Bằng cấp không được quá 100 ký tự"),
  field: z.string().min(2, "Chuyên ngành phải có ít nhất 2 ký tự").max(100, "Chuyên ngành không được quá 100 ký tự"),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }).optional(),
  description: z.string().max(1000, "Mô tả không được quá 1000 ký tự").optional(),
});

// Education Schema (for Response - with id)
export const EducationSchema = EducationRequestSchema.extend({
  id: z.string(),
});

// Experience Schema (for Request - with id for upsert)
export const ExperienceRequestSchema = z.object({
  id: z.string().optional(), // Optional for new items, required for updates
  company: z.string().min(2, "Tên công ty phải có ít nhất 2 ký tự").max(200, "Tên công ty không được quá 200 ký tự"),
  position: z.string().min(2, "Vị trí phải có ít nhất 2 ký tự").max(100, "Vị trí không được quá 100 ký tự"),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }).optional(),
  description: z.string().max(1000, "Mô tả không được quá 1000 ký tự").optional(),
});

// Experience Schema (for Response - with id)
export const ExperienceSchema = ExperienceRequestSchema.extend({
  id: z.string(),
});

// Skill Schema (for Request - with id for upsert)
export const SkillRequestSchema = z.object({
  id: z.string().optional(), // Optional for new items, required for updates
  name: z.string().min(1, "Tên kỹ năng là bắt buộc").max(100, "Tên kỹ năng không được quá 100 ký tự"),
  level: z.string().min(1, "Trình độ là bắt buộc"),
});

// Skill Schema (for Response - with id)
export const SkillSchema = SkillRequestSchema.extend({
  id: z.string(),
});

// Language Schema (for Request - with id for upsert)
export const LanguageRequestSchema = z.object({
  id: z.string().optional(), // Optional for new items, required for updates
  name: z.string().min(1, "Tên ngôn ngữ là bắt buộc").max(50, "Tên ngôn ngữ không được quá 50 ký tự"),
  proficiency: z.string().min(1, "Trình độ là bắt buộc"),
});

// Language Schema (for Response - with id)
export const LanguageSchema = LanguageRequestSchema.extend({
  id: z.string(),
});

// Project Schema (for Request - with id for upsert)
export const ProjectRequestSchema = z.object({
  id: z.string().optional(), // Optional for new items, required for updates
  name: z.string().min(2, "Tên dự án phải có ít nhất 2 ký tự").max(200, "Tên dự án không được quá 200 ký tự"),
  position: z.string().min(2, "Vị trí phải có ít nhất 2 ký tự").max(100, "Vị trí không được quá 100 ký tự"),
  description: z.string().min(10, "Mô tả phải có ít nhất 10 ký tự").max(1000, "Mô tả không được quá 1000 ký tự"),
  link: z.string().url("Link không hợp lệ").optional().or(z.literal("")),
});

// Project Schema (for Response - with id)
export const ProjectSchema = ProjectRequestSchema.extend({
  id: z.string(),
});

// Certificate Schema (for Request - with id for upsert)
export const CertificateRequestSchema = z.object({
  id: z.string().optional(), // Optional for new items, required for updates
  name: z.string().min(2, "Tên chứng chỉ phải có ít nhất 2 ký tự").max(200, "Tên chứng chỉ không được quá 200 ký tự"),
  issuer: z.string().min(2, "Tên tổ chức cấp phải có ít nhất 2 ký tự").max(200, "Tên tổ chức cấp không được quá 200 ký tự"),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
});

// Certificate Schema (for Response - with id)
export const CertificateSchema = CertificateRequestSchema.extend({
  id: z.string(),
});

// Award Schema (for Request - with id for upsert)
export const AwardRequestSchema = z.object({
  id: z.string().optional(), // Optional for new items, required for updates
  name: z.string().min(2, "Tên giải thưởng phải có ít nhất 2 ký tự").max(200, "Tên giải thưởng không được quá 200 ký tự"),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  description: z.string().max(1000, "Mô tả không được quá 1000 ký tự").optional(),
});

// Award Schema (for Response - with id)
export const AwardSchema = AwardRequestSchema.extend({
  id: z.string(),
});

// Upsert CV Profile Request Schema (with full validation)
export const UpsertCVProfileRequestSchema = z.object({
  personalInfo: PersonalInfoSchema,
  education: z.array(EducationRequestSchema).optional().default([]),
  experience: z.array(ExperienceRequestSchema).optional().default([]),
  skills: z.array(SkillRequestSchema).max(20, "Không được thêm quá 20 kỹ năng").optional().default([]),
  languages: z.array(LanguageRequestSchema).max(5, "Không được thêm quá 5 ngôn ngữ").optional().default([]),
  projects: z.array(ProjectRequestSchema).optional().default([]),
  certificates: z.array(CertificateRequestSchema).optional().default([]),
  awards: z.array(AwardRequestSchema).optional().default([]),
});

// CV Profile Entity Schema (Response)
export const CVProfileSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  personalInfo: PersonalInfoSchema,
  education: z.array(EducationSchema).optional().default([]),
  experience: z.array(ExperienceSchema).optional().default([]),
  skills: z.array(SkillSchema).optional().default([]),
  languages: z.array(LanguageSchema).optional().default([]),
  projects: z.array(ProjectSchema).optional().default([]),
  certificates: z.array(CertificateSchema).optional().default([]),
  awards: z.array(AwardSchema).optional().default([]),
  isActive: z.boolean().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  lastUpdated: z.string().optional(),
});

// Types
export type PersonalInfo = z.infer<typeof PersonalInfoSchema>;
export type EducationRequest = z.infer<typeof EducationRequestSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type ExperienceRequest = z.infer<typeof ExperienceRequestSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type SkillRequest = z.infer<typeof SkillRequestSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type LanguageRequest = z.infer<typeof LanguageRequestSchema>;
export type Language = z.infer<typeof LanguageSchema>;
export type ProjectRequest = z.infer<typeof ProjectRequestSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type CertificateRequest = z.infer<typeof CertificateRequestSchema>;
export type Certificate = z.infer<typeof CertificateSchema>;
export type AwardRequest = z.infer<typeof AwardRequestSchema>;
export type Award = z.infer<typeof AwardSchema>;
export type UpsertCVProfileRequest = z.infer<typeof UpsertCVProfileRequestSchema>;
export type CVProfile = z.infer<typeof CVProfileSchema>;
