import { createLoginSchema, createRegisterSchema } from "./auth.schema";
import { en } from "@/locales/en";
import { vi } from "@/locales/vi";

type Messages = typeof en;

function translate(messages: Messages, key: string): string {
  const value = key
    .split(".")
    .reduce<unknown>((value, segment) => {
      if (value && typeof value === "object" && segment in value) {
        return (value as Record<string, unknown>)[segment];
      }

      return key;
    }, messages);

  return typeof value === "string" ? value : key;
}

describe("auth schema localization", () => {
  it("uses English validation messages for the login schema", () => {
    const schema = createLoginSchema((key) => translate(en, key));
    const result = schema.safeParse({
      email: "",
      password: "",
    });

    expect(result.success).toBe(false);

    if (result.success) {
      return;
    }

    expect(result.error.flatten().fieldErrors.email?.[0]).toBe(
      en.authModal.validation.email.required
    );
    expect(result.error.flatten().fieldErrors.password?.[0]).toBe(
      en.authModal.validation.password.required
    );
  });

  it("uses Vietnamese validation messages for the register schema", () => {
    const schema = createRegisterSchema((key) => translate(vi, key));
    const result = schema.safeParse({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    });

    expect(result.success).toBe(false);

    if (result.success) {
      return;
    }

    const { fieldErrors } = result.error.flatten();

    expect(fieldErrors.name?.[0]).toBe(vi.authModal.validation.name.required);
    expect(fieldErrors.email?.[0]).toBe(vi.authModal.validation.email.required);
    expect(fieldErrors.password?.[0]).toBe(
      vi.authModal.validation.password.required
    );
    expect(fieldErrors.confirmPassword?.[0]).toBe(
      vi.authModal.validation.confirmPassword.required
    );
    expect(fieldErrors.acceptTerms?.[0]).toBe(
      vi.authModal.validation.acceptTerms.required
    );
  });
});
