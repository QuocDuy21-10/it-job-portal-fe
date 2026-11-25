import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { JobForm } from "./job-form";

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));
jest.mock("@/hooks/use-skill-catalog", () => ({
  useSkillCatalog: () => ({ skillOptions: [], isLoading: false }),
}));
jest.mock("@/features/company/hooks/use-company-options", () => ({
  useCompanyOptions: () => ({ companies: [], options: [] }),
}));
jest.mock("@/components/rich-text-editor", () => {
  const { forwardRef } = jest.requireActual("react");
  return {
    RichTextEditor: forwardRef(({ onChange }: any, _ref: unknown) => (
      <>
        <button type="button" onClick={() => onChange("<p>n</p>", null, "api")}>
          normalize
        </button>
        <button
          type="button"
          onClick={() => onChange("<p>e</p>", null, "user")}
        >
          edit
        </button>
      </>
    )),
  };
});
jest.mock("@/components/date-picker", () => {
  const { forwardRef } = jest.requireActual("react");
  return {
    DatePicker: forwardRef(({ onChange }: any, _ref: unknown) => (
      <button type="button" onClick={() => onChange(new Date(2026, 11, 20))}>
        pick
      </button>
    )),
  };
});

const job = {
  name: "Dev",
  skills: ["react"],
  company: { _id: "507f1f77bcf86cd799439021", name: "Acme", logo: null },
  locationCode: "ha-noi",
  salary: 1000,
  quantity: 1,
  formOfWork: "Full-time" as const,
  level: "Junior" as const,
  description: "<p>Long enough</p>",
  startDate: "2026-11-15T00:00:00.000Z",
  endDate: "2026-12-15T00:00:00.000Z",
  isActive: true,
};

const setup = (props = {}) => {
  const onSubmit = jest.fn().mockResolvedValue(true);
  const onDirtyChange = jest.fn();
  render(
    <>
      <JobForm
        formId="f"
        onSubmit={onSubmit}
        onDirtyChange={onDirtyChange}
        {...props}
      />
      <button type="submit" form="f">
        save
      </button>
    </>
  );
  return { onSubmit, onDirtyChange };
};

it("writes the picked day as a local date", async () => {
  const { onSubmit } = setup({ initialData: job });
  fireEvent.click(screen.getAllByText("pick")[1]);
  fireEvent.click(screen.getByText("save"));
  await waitFor(() => expect(onSubmit).toHaveBeenCalled());
  expect(onSubmit.mock.calls[0][0].endDate).toBe("2026-12-20");
});

it("ignores editor normalization but tracks user edits", async () => {
  const { onDirtyChange } = setup({ initialData: job });
  fireEvent.click(screen.getByText("normalize"));
  expect(onDirtyChange).not.toHaveBeenCalledWith(true);
  fireEvent.click(screen.getByText("edit"));
  await waitFor(() => expect(onDirtyChange).toHaveBeenLastCalledWith(true));
});

it("starts a new job with no salary, level or work type chosen", async () => {
  const { onSubmit } = setup();
  fireEvent.click(screen.getByText("save"));
  for (const key of ["salary", "level", "workType"]) {
    expect(
      await screen.findByText(`adminPages.jobs.form.errors.${key}`)
    ).toBeInTheDocument();
  }
  expect(onSubmit).not.toHaveBeenCalled();
});
