import { updateUserFormSchema } from "./user.schema";

describe("updateUserFormSchema", () => {
  it("accepts valid enum role strings and company._id", () => {
    const result = updateUserFormSchema().safeParse({
      name: "Alice Admin",
      email: "alice@example.com",
      password: "",
      role: "HR",
      company: {
        _id: "507f1f77bcf86cd799439021",
        name: "Acme HR",
      },
    });

    expect(result.success).toBe(true);
  });

  it("rejects an unknown role string", () => {
    const result = updateUserFormSchema().safeParse({
      name: "Alice Admin",
      email: "alice@example.com",
      password: "",
      role: "ADMIN",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      "Role must be SUPER ADMIN, HR, or NORMAL USER"
    );
  });

  it("requires company._id when role is HR", () => {
    const result = updateUserFormSchema().safeParse({
      name: "Alice Admin",
      email: "alice@example.com",
      password: "",
      role: "HR",
    });

    expect(result.success).toBe(false);
    expect(
      result.error?.issues.some(
        (issue) =>
          issue.path.join(".") === "company._id" &&
          issue.message === "Company is required for HR role"
      )
    ).toBe(true);
  });

  it("rejects an invalid company MongoId when role is HR", () => {
    const result = updateUserFormSchema().safeParse({
      name: "Alice Admin",
      email: "alice@example.com",
      password: "",
      role: "HR",
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
