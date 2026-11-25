import { en } from "./en";
import { vi } from "./vi";

const keys = (value: object, prefix = ""): string[] =>
  Object.entries(value).flatMap(([key, child]) =>
    typeof child === "object" && child !== null
      ? keys(child, `${prefix}${key}.`)
      : [`${prefix}${key}`]
  );

it("adminPages has the same keys in en and vi", () => {
  expect(keys(vi.adminPages).sort()).toEqual(keys(en.adminPages).sort());
});
