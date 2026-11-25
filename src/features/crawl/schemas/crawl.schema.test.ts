import { createJobSourceSchema } from "./crawl.schema";

const parse = (value: object) =>
  createJobSourceSchema().safeParse({
    provider: "LEVER",
    boardToken: "axon",
    companyName: "Axon",
    ...value,
  });

it("trims and lowercases the token", () => {
  expect(
    parse({ boardToken: "  AXON-vn ", companyName: " Axon " }).data
  ).toEqual({ provider: "LEVER", boardToken: "axon-vn", companyName: "Axon" });
});

it.each([
  [{ provider: undefined }, "provider"],
  [{ boardToken: "a/b" }, "boardToken"],
  [{ companyName: "  " }, "companyName"],
])("rejects %p", (value, field) => {
  expect(parse(value).error?.issues[0]).toMatchObject({
    path: [field],
    message: `adminPages.crawl.addDialog.errors.${field}`,
  });
});
