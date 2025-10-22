import { z } from "zod";

// export const UserRolesSchema = z.enum(["user", "admin"]);
// export type UserRole = z.infer<typeof UserRolesSchema>;

export const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  // roles: z.array(UserRolesSchema),
});
export type User = z.infer<typeof UserSchema>;
