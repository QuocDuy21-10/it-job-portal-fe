import { z } from "zod";

export const ApiResponseSchema = <T extends z.ZodTypeAny>(data: T) =>
  z.object({
    statusCode: z.union([z.number(), z.string()]),
    message: z.string().nullable(),
    data: data.optional(),
    timestamp: z.string().nullable().optional(),
    error: z.union([z.string(), z.array(z.string())]).optional(),
  });

export type ApiResponse<T> = {
  statusCode: number | string;
  message: string | null;
  data?: any;
  timestamp?: string | null;
  error?: string | string[];
};
