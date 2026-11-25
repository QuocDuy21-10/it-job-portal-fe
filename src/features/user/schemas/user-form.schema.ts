import type { Translate } from "@/shared/types/i18n";
import {
  createUserSchemaBase,
  requireHrCompany,
  updateUserSchemaBase,
  type UserErrorMessages,
} from "./user.schema";

// Kept apart from user.schema.ts: that file is reachable from public routes,
// which must not reference admin-only translation keys.
const identity: Translate = (key) => key;
const ERROR = "adminPages.users.form.errors";

const messages = (t: Translate): UserErrorMessages => ({
  name: t(`${ERROR}.name`),
  email: t(`${ERROR}.email`),
  password: t(`${ERROR}.password`),
  role: t(`${ERROR}.role`),
  company: t(`${ERROR}.company`),
});

export const createUserFormSchema = (t: Translate = identity) =>
  createUserSchemaBase(messages(t)).superRefine(requireHrCompany(messages(t)));

export const updateUserFormSchema = (t: Translate = identity) =>
  updateUserSchemaBase(messages(t)).superRefine(requireHrCompany(messages(t)));
