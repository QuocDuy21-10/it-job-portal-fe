import { act, fireEvent, render, screen } from "@testing-library/react";
import { useSelector } from "react-redux";
import JobDetailPageClient from "./job-detail-page-client";

const mockOpenModal = jest.fn();
const mockUseSelector = useSelector as unknown as jest.Mock;
const mockToggleSaveJob = jest.fn();

let isAuthenticated = false;
let isSaved = false;
let isHydrated = true;

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
  useStore: jest.fn(),
}));

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({
    t: (key: string) => {
      if (key === "jobDetailPage.actions.applyNow") {
        return "Apply now";
      }

      if (key === "jobDetailPage.actions.saveJob") {
        return "Save job";
      }

      if (key === "jobDetailPage.actions.saved") {
        return "Saved";
      }

      return key;
    },
  }),
}));

jest.mock("@/hooks/use-job-favorite", () => ({
  useJobFavorite: () => ({
    isSaved,
    toggleSaveJob: mockToggleSaveJob,
    isLoading: false,
    isHydrated,
  }),
}));

jest.mock("@/features/auth/redux/auth.slice", () => ({
  selectIsAuthenticated: jest.fn(),
}));

jest.mock("@/contexts/auth-modal-context", () => ({
  useAuthModal: () => ({
    openModal: mockOpenModal,
  }),
}));

jest.mock("@/components/modals/apply-modal", () => ({
  __esModule: true,
  default: ({ isOpen }: { isOpen: boolean }) => (
    <div data-testid="apply-modal">{isOpen ? "open" : "closed"}</div>
  ),
}));

describe("JobDetailPageClient", () => {
  beforeEach(() => {
    isAuthenticated = false;
    isSaved = false;
    isHydrated = true;
    mockOpenModal.mockReset();
    mockToggleSaveJob.mockReset();
    mockUseSelector.mockImplementation(() => isAuthenticated);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("opens the auth modal for unauthenticated apply and continues with the apply modal after login success", () => {
    render(
      <JobDetailPageClient
        companyId="company-1"
        jobId="job-1"
        jobTitle="Frontend Engineer"
      />
    );

    expect(screen.getByTestId("apply-modal")).toHaveTextContent("closed");

    fireEvent.click(screen.getByRole("button", { name: "Apply now" }));

    expect(mockOpenModal).toHaveBeenCalledWith(
      "signin",
      expect.objectContaining({
        onSuccess: expect.any(Function),
      })
    );

    const modalOptions = mockOpenModal.mock.calls[0][1] as {
      onSuccess: () => void;
    };

    act(() => {
      modalOptions.onSuccess();
    });

    expect(screen.getByTestId("apply-modal")).toHaveTextContent("open");
  });

  it("opens the apply modal immediately for authenticated users", () => {
    isAuthenticated = true;

    render(
      <JobDetailPageClient
        companyId="company-1"
        jobId="job-1"
        jobTitle="Frontend Engineer"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Apply now" }));

    expect(mockOpenModal).not.toHaveBeenCalled();
    expect(screen.getByTestId("apply-modal")).toHaveTextContent("open");
  });

  it("renders an unsaved disabled save button before hydration completes", () => {
    isHydrated = false;

    render(
      <JobDetailPageClient
        companyId="company-1"
        jobId="job-1"
        jobTitle="Frontend Engineer"
      />
    );

    expect(screen.getByRole("button", { name: "Save job" })).toBeDisabled();
  });

  it("renders the saved label when the job is already saved after hydration", () => {
    isSaved = true;

    render(
      <JobDetailPageClient
        companyId="company-1"
        jobId="job-1"
        jobTitle="Frontend Engineer"
      />
    );

    expect(screen.getByRole("button", { name: "Saved" })).toBeEnabled();
  });
});
