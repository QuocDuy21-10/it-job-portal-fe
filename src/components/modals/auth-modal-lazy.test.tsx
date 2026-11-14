import { fireEvent, render, screen } from "@testing-library/react";
import { AuthModalLazy } from "./auth-modal-lazy";
import { AuthModalProvider, useAuthModal } from "@/contexts/auth-modal-context";

const mockModalLoaded = jest.fn();

// The factory runs when the modal module is first imported, so it doubles as a "was the chunk loaded" probe.
jest.mock("@/components/modals/auth-modal", () => {
  mockModalLoaded();
  return { AuthModal: () => <div data-testid="auth-modal" /> };
});

function Controls() {
  const { openModal, closeModal } = useAuthModal();

  return (
    <>
      <button type="button" onClick={() => openModal()}>
        open
      </button>
      <button type="button" onClick={closeModal}>
        close
      </button>
    </>
  );
}

const renderLazy = () =>
  render(
    <AuthModalProvider>
      <Controls />
      <AuthModalLazy />
    </AuthModalProvider>
  );

describe("AuthModalLazy", () => {
  it("neither loads nor renders the modal before it is opened", () => {
    renderLazy();

    expect(mockModalLoaded).not.toHaveBeenCalled();
    expect(screen.queryByTestId("auth-modal")).not.toBeInTheDocument();
  });

  it("loads the modal on first open and keeps it mounted after closing", async () => {
    renderLazy();

    fireEvent.click(screen.getByRole("button", { name: "open" }));

    expect(await screen.findByTestId("auth-modal")).toBeInTheDocument();
    expect(mockModalLoaded).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "close" }));

    expect(screen.getByTestId("auth-modal")).toBeInTheDocument();
  });
});
