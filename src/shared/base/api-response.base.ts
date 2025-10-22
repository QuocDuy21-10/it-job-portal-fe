import { z } from "zod";

export const ApiResponseSchema = <T extends z.ZodTypeAny>(data: T) =>
  z.object({
    statusCode: z.number(),
    message: z.string().nullable(),
    data: data,
  });

export type ApiResponse<T> = {
  statusCode: number;
  message: string | null;
  data: T;
  timestamp?: string | null;
  error?: string | null;
};
