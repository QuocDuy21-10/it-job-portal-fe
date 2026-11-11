import { act, renderHook, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { useCV } from "@/features/cv-builder/hooks/use-cv";
import { useCvEditor } from "@/features/cv-builder/hooks/use-cv-editor";

jest.mock("@/features/cv-builder/hooks/use-cv", () => ({
  useCV: jest.fn(),
}));

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

jest.mock("sonner", () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

const mockUseCV = useCV as jest.Mock;

describe("useCvEditor", () => {
  const upsertCV = jest.fn();
  const fetchMyCVProfile = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    fetchMyCVProfile.mockResolvedValue(null);
    mockUseCV.mockReturnValue({
      isLoading: false,
      error: null,
      upsertCV,
      fetchMyCVProfile,
      clearError: jest.fn(),
    });
  });

  const renderEditor = async () => {
    const hook = renderHook(() => useCvEditor());
    await waitFor(() =>
      expect(hook.result.current.isInitialLoading).toBe(false)
    );
    return hook;
  };

  it("adds, updates and removes list items", async () => {
    const { result } = await renderEditor();
    const edu = {
      id: "e-1",
      school: "A",
      degree: "B",
      field: "C",
      startDate: "2020-01-01",
    };

    act(() => result.current.addItem("education", edu));
    expect(result.current.cvData.education).toEqual([edu]);

    act(() => result.current.updateItem("education", "e-1", "school", "Z"));
    expect(result.current.cvData.education[0].school).toBe("Z");

    act(() => result.current.removeItem("education", "e-1"));
    expect(result.current.cvData.education).toEqual([]);
  });

  it("updates a personal info field", async () => {
    const { result } = await renderEditor();

    act(() => result.current.updatePersonalInfo("fullName", "Tran B"));

    expect(result.current.cvData.personalInfo.fullName).toBe("Tran B");
  });

  it("shows a validation toast and skips upsert when the CV is invalid", async () => {
    const { result } = await renderEditor();

    await act(async () => {
      await result.current.save();
    });

    expect(toast.error).toHaveBeenCalledWith(
      "cvPage.validationError",
      expect.objectContaining({ duration: 4000 })
    );
    expect(upsertCV).not.toHaveBeenCalled();
  });
});
