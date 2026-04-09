import { z } from "zod";

export const MONGO_ID_REGEX = /^[a-f\d]{24}$/i;

export const mongoIdStringSchema = ({
  requiredMessage = "This field is required",
  invalidMessage = "Invalid MongoDB ObjectId",
}: {
  requiredMessage?: string;
  invalidMessage?: string;
} = {}) =>
  z
    .string()
    .trim()
    .min(1, requiredMessage)
    .regex(MONGO_ID_REGEX, invalidMessage);
