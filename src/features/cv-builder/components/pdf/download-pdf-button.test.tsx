import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import DownloadPDFButton from "./download-pdf-button";
import type { ICVProfile } from "@/shared/types/cv";

const mockToBlob = jest.fn();
const mockPdf = jest.fn((_element: unknown) => ({ toBlob: mockToBlob }));
const mockToastError = jest.fn();

jest.mock("@react-pdf/renderer", () => ({
  pdf: (element: unknown) => mockPdf(element),
}));

jest.mock("@/features/cv-builder/components/pdf/cv-pdf-document", () => ({
  __esModule: true,
  default: function MockCVPdfDocument() {
    return null;
  },
}));

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

jest.mock("sonner", () => ({
  toast: { error: (...args: unknown[]) => mockToastError(...args) },
}));

const cvData = {
  personalInfo: { fullName: "Nguyen Van A", phone: "", email: "" },
} as unknown as ICVProfile;

describe("DownloadPDFButton", () => {
  let clickSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    URL.createObjectURL = jest.fn(() => "blob:cv");
    URL.revokeObjectURL = jest.fn();
    clickSpy = jest
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});
  });

  afterEach(() => {
    clickSpy.mockRestore();
  });

  it("does not generate a PDF until clicked", () => {
    render(<DownloadPDFButton cvData={cvData} />);

    expect(
      screen.getByRole("button", { name: "downloadPdfButton.download" })
    ).toBeEnabled();
    expect(mockPdf).not.toHaveBeenCalled();
  });

  it("generates the PDF for the chosen template and downloads it", async () => {
    mockToBlob.mockResolvedValue(new Blob(["pdf"]));
    render(
      <DownloadPDFButton cvData={cvData} template="modern" fileName="CV" />
    );

    fireEvent.click(
      screen.getByRole("button", { name: "downloadPdfButton.download" })
    );

    expect(
      await screen.findByRole("button", {
        name: "downloadPdfButton.generating",
      })
    ).toBeDisabled();

    await waitFor(() => expect(clickSpy).toHaveBeenCalledTimes(1));

    const element = mockPdf.mock.calls[0][0] as {
      props: { cvData: ICVProfile; template: string };
    };
    expect(element.props).toEqual({ cvData, template: "modern" });

    const link = clickSpy.mock.contexts[0] as HTMLAnchorElement;
    expect(link.href).toBe("blob:cv");
    expect(link.download).toMatch(/^CV_Nguyen_Van_A_\d{4}-\d{2}-\d{2}\.pdf$/);

    expect(
      await screen.findByRole("button", { name: "downloadPdfButton.download" })
    ).toBeEnabled();
    await waitFor(() =>
      expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:cv")
    );
  });

  it("shows a toast and re-enables the button when generation fails", async () => {
    mockToBlob.mockRejectedValue(new Error("boom"));
    render(<DownloadPDFButton cvData={cvData} />);

    fireEvent.click(
      screen.getByRole("button", { name: "downloadPdfButton.download" })
    );

    await waitFor(() =>
      expect(mockToastError).toHaveBeenCalledWith("downloadPdfButton.error")
    );
    expect(
      screen.getByRole("button", { name: "downloadPdfButton.download" })
    ).toBeEnabled();
    expect(clickSpy).not.toHaveBeenCalled();
  });
});
