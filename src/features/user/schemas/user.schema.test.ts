import { updateUserFormSchema } from "./user.schema";

describe("updateUserFormSchema", () => {
  const hrRoleId = "507f1f77bcf86cd799439012";

  it("accepts valid MongoId strings for role and company._id", () => {
    const result = updateUserFormSchema(hrRoleId).safeParse({
      name: "Alice Admin",
      email: "alice@example.com",
      password: "",
      role: hrRoleId,
      company: {
        _id: "507f1f77bcf86cd799439021",
        name: "Acme HR",
      },
    });

    expect(result.success).toBe(true);
  });

  it("rejects an invalid role MongoId", () => {
    const result = updateUserFormSchema(hrRoleId).safeParse({
      name: "Alice Admin",
      email: "alice@example.com",
      password: "",
      role: "role-hr",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      "Role must be a valid MongoDB ObjectId"
    );
  });

  it("rejects an invalid company MongoId when role is HR", () => {
    const result = updateUserFormSchema(hrRoleId).safeParse({
      name: "Alice Admin",
      email: "alice@example.com",
      password: "",
      role: hrRoleId,
      company: {
        _id: "company-1",
        name: "Acme HR",
      },
    });

    expect(result.success).toBe(false);
    expect(
      result.error?.issues.some(
        (issue) =>
          issue.path.join(".") === "company._id" &&
          issue.message === "Company ID must be a valid MongoDB ObjectId"
      )
    ).toBe(true);
  });
});
