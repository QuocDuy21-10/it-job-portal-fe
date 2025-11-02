import { z } from "zod";

export const FileSchema = z.object({
  fileName: z.string(),
  fileUpload: z.any(), // For File object
  folderType: z.string(),
});

// Types
export type File = z.infer<typeof FileSchema>;
