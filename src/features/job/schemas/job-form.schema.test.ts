import { createJobSchema } from "./job-form.schema";

const valid = {
  name: "Dev",
  skills: ["react"],
  company: { _id: "507f1f77bcf86cd799439021", name: "Acme", logo: null },
  locationCode: "ha-noi",
  salary: 0,
  quantity: 1,
  formOfWork: "Full-time",
  level: "Junior",
  description: "<p>Long enough</p>",
  startDate: "2026-11-15",
  endDate: "2026-12-15",
  isActive: true,
};
const errors = (override: object) =>
  createJobSchema()
    .safeParse({ ...valid, ...override })
    .error?.issues.map((issue) => `${issue.path.join(".")}:${issue.message}`);

it("accepts a valid job with salary 0", () => {
  expect(errors({})).toBeUndefined();
});

it.each([["2026-11-15"], ["2026-11-14"]])("rejects end date %s", (endDate) => {
  expect(errors({ endDate })).toEqual([
    "endDate:adminPages.jobs.form.errors.endBeforeStart",
  ]);
});

it("reports an empty level, salary and company in the form's words", () => {
  expect(
    errors({
      level: undefined,
      salary: undefined,
      company: { _id: "", name: "", logo: null },
    })
  ).toEqual(
    expect.arrayContaining([
      "level:adminPages.jobs.form.errors.level",
      "salary:adminPages.jobs.form.errors.salary",
      "company._id:adminPages.jobs.form.errors.company",
    ])
  );
});
