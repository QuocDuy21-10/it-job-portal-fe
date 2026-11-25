import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  RESUME_STATUSES,
  UpdateResumeFormData,
} from "@/features/resume/schemas/resume.schema";
import { ResumeForm } from "./resume-form";

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

it("submits only the status and shows the history", async () => {
  const onSubmit = jest.fn().mockResolvedValue(true);
  render(
    <>
      <ResumeForm
        formId="f"
        onSubmit={onSubmit}
        resume={
          {
            _id: "1",
            email: "an@example.com",
            userId: "u",
            url: "resume/cv.pdf",
            status: "REVIEWING",
            histories: [
              {
                status: "PENDING",
                updatedAt: new Date(2026, 10, 15, 9, 12).toISOString(),
                updatedBy: { _id: "2", email: "hr@example.com" },
              },
            ],
          } as any
        }
      />
      <button type="submit" form="f">
        save
      </button>
    </>
  );
  expect(screen.getByText("an@example.com")).toBeInTheDocument();
  expect(screen.getByText(/15\/11\/2026 09:12/)).toBeInTheDocument();
  fireEvent.click(screen.getByText("save"));
  await waitFor(() =>
    expect(onSubmit.mock.calls[0][0]).toEqual({ status: "REVIEWING" })
  );
});

it("offers the interviewing status", () => {
  expect(RESUME_STATUSES).toContain("INTERVIEWING");
  expect(UpdateResumeFormData.parse({ status: "INTERVIEWING" })).toEqual({
    status: "INTERVIEWING",
  });
});
